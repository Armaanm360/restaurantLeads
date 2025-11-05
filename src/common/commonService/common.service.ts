import { Request } from 'express';
import AbstractServices from '../../abstract/abstract.service';
import { clouddebugger } from 'googleapis/build/src/apis/clouddebugger';
import { airTicketPayloadFormatter } from '../types/airticketutils';
import { any } from 'joi';
import {
  IAirTicketDb,
  IClTrxnBody,
  IFlightDetailsDb,
  IRefundDb,
  IVTrxn,
} from '../helpers/commonTypes';
import {
  formatDate,
  generateNextGroupCode,
  separateCombClientToId,
} from '../helpers/common.helper';
import { numRound } from '../types/commonTypes';
import { error } from 'console';
// import { DoubleEntryHelpers } from '../helpers/doubleEntry.helper';

class CommonService extends AbstractServices {
  constructor() {
    super();
  }
  //add inquiry
  // Enhanced moveClients method
  public async moveClients(req: Request) {
    try {
      const model = this.Model.agentDashboardModel();

      const getSingleEntryClient = await model.getSingleEntryClient(76);
      const getDoubleEntryClient = await model.getDoubleEntryClient(154);

      const columnSingleInfo: any = await model.columnSingle();
      const columnDoubleInfo: any = await model.columnDouble();

      const columnSingle = Object.keys(columnSingleInfo);
      const columnDouble = Object.keys(columnDoubleInfo);

      const commonColumns = columnSingle.filter((column) =>
        columnDouble.includes(column)
      );

      const newColumn = 'client_code';
      commonColumns.push(newColumn);

      console.log({ commonColumns });

      let successCount = 0;
      let failedCount = 0;
      const failedRecords: any[] = [];

      for (const client of getSingleEntryClient) {
        const transformedClient: Record<string, any> = {};

        // column mapping
        for (const column of commonColumns) {
          if (column === 'client_id') continue;
          transformedClient[column] = client[column];

          if (column === 'client_org_agency') transformedClient[column] = 154;
          if (column === 'client_code')
            transformedClient['client_code'] = client['client_entry_id'];
          // if (column === 'client_created_by') transformedClient[column] = 126;
        }

        // 2️⃣ Employee Mapping Logic
        const empCardInfo = await model.getSingleEntryEmployeeCardId(
          client.client_id
        );
        if (empCardInfo && empCardInfo.employee_card_id) {
          const empInfo = await model.getDoubleEntryCarEmployeeId(
            empCardInfo.employee_card_id
          );
          if (empInfo && empInfo.employee_id) {
            transformedClient.client_contacted_person = empInfo.employee_id;
          }
        }

        // 2️⃣ Employee created by new Logic
        const singleEntryUserName = await model.getSingleEntryClientUserName(
          client.client_id
        );

        if (singleEntryUserName && singleEntryUserName.user_username) {
          const clientInfo = await model.getDoubleEntryUserId(
            singleEntryUserName.user_username
          );

          if (clientInfo && clientInfo.user_id) {
            transformedClient.client_created_by = clientInfo.user_id;
          } else {
            // fallback value
            transformedClient.client_created_by = 1666;
          }
        } else {
          // fallback value if username missing
          transformedClient.client_created_by = 1666;
        }

        // Opening balance logic
        const opening_balance = Number(client.client_last_balance || 0);

        console.log('opening_balance', opening_balance);

        let ac_vou1 = null,
          ac_vou2 = null,
          clTrans = null;

        const voucherNo = `OB-${transformedClient.client_code}`;

        if (opening_balance !== 0) {
          if (opening_balance < 0) {
            // 🧾 Client Due (-balance)
            const dueAmount = Math.abs(opening_balance);

            ac_vou1 = await model.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id: this.accHead['Accounts Receivables'], // Asset
              voucher_no: voucherNo,
              amount: 0,
              trans_type: 'DEBIT',
              description: `Service due from ${client.client_name}`,
              payment_type: 'OPENING_BALANCE',
            });

            ac_vou2 = await model.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id: this.accHead['Sales/Service Income'], // Income
              voucher_no: voucherNo,
              amount: 0,
              trans_type: 'CREDIT',
              description: `Service due from ${client.client_name}`,
              payment_type: 'OPENING_BALANCE',
            });
          } else if (opening_balance > 0) {
            // 💰 Client Advance (+balance)
            const advanceAmount = opening_balance;

            ac_vou1 = await model.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id: this.accHead['Accounts Receivables'], // Reduce Receivable
              voucher_no: voucherNo,
              amount: 0,
              trans_type: 'CREDIT',
              description: `Advance received from ${client.client_name}`,
              payment_type: 'OPENING_BALANCE',
            });

            ac_vou2 = await model.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id: 2007, // Advance from Client (Liability)
              voucher_no: voucherNo,
              amount: 0,
              trans_type: 'DEBIT',
              description: `Advance adjustment for ${client.client_name}`,
              payment_type: 'OPENING_BALANCE',
            });
          }
        }

        // Include vouchers in client data
        transformedClient.ac_vou1 = ac_vou1;
        transformedClient.ac_vou2 = ac_vou2;
        transformedClient.opening_balance = opening_balance;

        console.log('freaking', transformedClient);

        try {
          // 1️⃣ Insert into double entry clients table
          const client_id = await model.insertDoubleEntry(transformedClient);
          successCount++;

          // 2️⃣ Now insert into client transaction table
          await model.insertClientTrans({
            ctrxn_voucher: voucherNo,
            client_id: client_id, // returned id
            combined_id: null, // or your logic for combined id
            ctrxn_amount: Math.abs(opening_balance),
            ctrxn_created_at: new Date(), // or specific date if available
            ctrxn_note: `Opening balance entry for ${client.client_name}`,
            ctrxn_particular_id: 31, // your particular id
            ctrxn_type: opening_balance < 0 ? 'DEBIT' : 'CREDIT', // depend on due/advance
            ctrxn_pay_type: 'OPENING_BALANCE',
          });
        } catch (err: any) {
          failedCount++;
          failedRecords.push({
            client_id: client.client_id,
            reason: err?.message || JSON.stringify(err) || 'Unknown error',
          });
          console.error(`Client ${client.client_id} failed:`, err);
        }
      }

      const result = {
        success: failedCount === 0,
        code:
          failedCount === 0
            ? this.StatusCode.HTTP_OK
            : this.StatusCode.HTTP_PARTIAL_CONTENT,
        migrated: {
          total: getSingleEntryClient.length,
          success: successCount,
          failed: failedCount,
          failedRecords,
          data: getSingleEntryClient,
        },
      };

      // Do NOT throw error here – let the process complete gracefully
      return result;
    } catch (error) {
      console.error('Error in moveClients:', error);
      throw error; // Re-throw to be caught by the main controller
    }
  }

  public async movePassports(req: Request) {
    const model = this.Model.agentDashboardModel();

    // Step 1: Get data from single-entry system
    const getSingleEntryPassports = await model.getSingleEntryPassport(76);

    // Step 2: Helper to clean date format (remove .000 if exists)
    function sanitizeDateOnly(dateStr: string | null): string | null {
      if (!dateStr) return null;
      if (dateStr.startsWith('0000-00-00')) return null; // handle zero date

      const dt = new Date(dateStr);
      if (isNaN(dt.getTime())) return null;

      const year = dt.getFullYear();
      const month = String(dt.getMonth() + 1).padStart(2, '0');
      const day = String(dt.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // Step 3: Transform single-entry data to match double-entry schema
    const transformedPassports = getSingleEntryPassports.map(
      (passport: any) => ({
        passport_org_agency: 154, // fixed
        passport_created_by: 1666, // fixed

        passport_name: passport.passport_name || null,
        passport_person_type: passport.passport_person_type || null,
        passport_no: passport.passport_passport_no || null,
        passport_nid_no: passport.passport_nid_no || null,
        passport_mobile_no: passport.passport_mobile_no || null,
        passport_email: passport.passport_email || null,

        passport_date_of_birth: sanitizeDateOnly(
          passport.passport_date_of_birth
        ),
        passport_date_of_issue: sanitizeDateOnly(
          passport.passport_date_of_issue
        ),
        passport_date_of_expire: sanitizeDateOnly(
          passport.passport_date_of_expire
        ),

        passport_copy: passport.passport_scan_copy || null,
        passport_status_id: passport.passport_status_id || null,

        passport_created_at:
          sanitizeDateOnly(passport.passport_create_date) || new Date(),
        passport_is_deleted: 0,
        passport_deleted_by: null,
      })
    );

    // Step 4: Insert into double-entry table
    if (transformedPassports.length > 0) {
      await model.insertDoubleEntryPassport(transformedPassports);
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      inserted: transformedPassports.length,
    };
  }

  public async moveAirports(req: Request) {
    const model = this.Model.agentDashboardModel();

    // Step 1: Get data from single entry
    const singleEntryAirports = await model.getSingleEntryAirports();

    const transformedAirports = singleEntryAirports.map((airport: any) => ({
      airline_id: airport.airline_id,
      airline_country_id: airport.airline_country_id || null,
      airline_airport: airport.airline_airport || '',
      airline_iata_code: airport.airline_iata_code || '',
      airline_create_date: airport.airline_create_date || new Date(),
      airline_is_deleted: airport.airline_is_deleted || 0,
    }));

    const uniqueAirports = new Map();
    const duplicates: any = [];

    transformedAirports.forEach((airport: any) => {
      const key = `${airport.airline_country_id}-${airport.airline_iata_code}`;

      if (uniqueAirports.has(key)) {
        duplicates.push(airport);
      } else {
        uniqueAirports.set(key, airport);
      }
    });

    const uniqueAirportsArray = Array.from(uniqueAirports.values());

    if (uniqueAirportsArray.length > 0) {
      await model.insertDoubleEntryAirports(uniqueAirportsArray);
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      inserted: uniqueAirportsArray.length,
      duplicates: duplicates.length,
      duplicateItems: duplicates, // Return the duplicate items in the response
    };
  }

  public async moveAirlines(req: Request) {
    const model = this.Model.agentDashboardModel();

    // Step 1: Get airlines from single entry
    const singleEntryAirlines = await model.getSingleEntryAirlines();

    // Step 2: Transform data to match double entry schema
    const transformedAirlines = singleEntryAirlines.map((airline: any) => ({
      airline_id: airline.airline_id,
      airline_code: airline.airline_code?.trim() || '',
      numeric_code: airline.airline_numeric_code?.trim() || '',
      airline_name: airline.airline_name?.trim() || '',
      airline_create_date: airline.airline_create_date || new Date(),
      airline_is_deleted: airline.airline_is_deleted || 0,
      airlines_created_by: airline.airlines_created_by || null,
    }));

    // Step 3: Filter duplicates by unique key - here by airline_code (you can customize)
    const uniqueAirlines = new Map<string, any>();
    const duplicates: any[] = [];

    transformedAirlines.forEach((airline: any) => {
      const key = airline.airline_code.toLowerCase(); // case-insensitive unique key
      if (uniqueAirlines.has(key)) {
        duplicates.push(airline);
      } else {
        uniqueAirlines.set(key, airline);
      }
    });

    const uniqueAirlinesArray = Array.from(uniqueAirlines.values());

    // Step 4: Insert unique airlines into double entry
    if (uniqueAirlinesArray.length > 0) {
      await model.insertDoubleEntryAirlines(uniqueAirlinesArray);
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      inserted: uniqueAirlinesArray.length,
      duplicates: duplicates.length,
      duplicateItems: duplicates,
    };
  }

  public async moveVendors(req: Request) {
    try {
      const model = this.Model.agentDashboardModel();

      const getSingleEntryVendor = await model.getSingleEntryVendor(76);
      const getDoubleEntryVendor = await model.getDoubleEntryVendor(154);

      const columnSingleInfo: any = await model.columnSingleVendor();
      const columnDoubleInfo: any = await model.columnDoubleVendor();

      const columnSingle = Object.keys(columnSingleInfo);
      const columnDouble = Object.keys(columnDoubleInfo);

      const commonColumns = columnSingle.filter((column) =>
        columnDouble.includes(column)
      );

      console.log({ commonColumns });

      let successCount = 0;
      let failedCount = 0;
      const failedRecords: any[] = [];

      for (const vendor of getSingleEntryVendor) {
        const transformedVendor: Record<string, any> = {};

        // column mapping
        for (const column of commonColumns) {
          if (column === 'vendor_id') continue;

          transformedVendor[column] = vendor[column];

          if (column === 'vendor_org_agency') transformedVendor[column] = 154;
          if (column === 'vendor_code')
            transformedVendor['vendor_code'] = vendor['vendor_entry_id'];
          if (column === 'vendor_created_by') transformedVendor[column] = 126;
        }

        // Opening balance logic
        const vendor_balance = Number(vendor.vendor_lbalance || 0);
        console.log('vendor_balance:', vendor_balance);

        let ac_vou1 = null,
          ac_vou2 = null,
          venTrans = null;

        const voucherNo = `OB-${transformedVendor['vendor_code']}`;

        try {
          if (vendor_balance !== 0) {
            if (vendor_balance < 0) {
              // 🧾 Vendor Payable (-balance)
              const dueAmount = Math.abs(vendor_balance);

              ac_vou1 = await model.insertAccVoucherDb({
                serial_no: 1,
                acc_head_id: this.accHead['Purchase(Expenses)'], // Expense
                acc_vou1: this.accHead['Purchase(Expenses)'],
                acc_vou2: this.accHead['Accounts Payable'],
                voucher_no: voucherNo,
                amount: 0,
                trans_type: 'DEBIT',
                description: `Service received from ${vendor.vendor_name}`,
                payment_type: 'OPENING_BALANCE',
              });

              ac_vou2 = await model.insertAccVoucherDb({
                serial_no: 2,
                acc_head_id: this.accHead['Accounts Payable'], // Liability
                acc_vou1: this.accHead['Purchase(Expenses)'],
                acc_vou2: this.accHead['Accounts Payable'],
                voucher_no: voucherNo,
                amount: 0,
                trans_type: 'CREDIT',
                description: `Due to ${vendor.vendor_name}`,
                payment_type: 'OPENING_BALANCE',
              });
            } else if (vendor_balance > 0) {
              // 💰 Vendor Advance (+balance)
              const advanceAmount = vendor_balance;

              ac_vou1 = await model.insertAccVoucherDb({
                serial_no: 1,
                acc_head_id:
                  this.accHead[
                    'Advance, Deposit and Prepayment(Current Assets)'
                  ],
                acc_vou2: 2003,
                voucher_no: voucherNo,
                amount: 0,
                trans_type: 'DEBIT',
                description: `Advance paid to ${vendor.vendor_name}`,
                payment_type: 'OPENING_BALANCE',
              });

              ac_vou2 = await model.insertAccVoucherDb({
                serial_no: 2,
                acc_head_id: 2003,
                voucher_no: voucherNo,
                amount: 0,
                trans_type: 'CREDIT',
                description: `Advance paid through ${vendor.vendor_name}`,
                payment_type: 'OPENING_BALANCE',
              });
            }
          }

          // Include vouchers in vendor data
          transformedVendor.acc_vou1 = ac_vou1;
          transformedVendor.acc_vou2 = ac_vou2;
          transformedVendor.opening_balance = vendor_balance;

          console.log('Vendor Transformed:', transformedVendor);

          // 1️⃣ Insert into double entry vendors table
          const vendor_id = await model.insertDoubleEntryVendor(
            transformedVendor
          );
          successCount++;

          console.log('vindol', vendor_id);
          console.log('vendor_balance', vendor_balance);

          // 2️⃣ Now insert into vendor transaction table
          try {
            await model.insertVendorTrans({
              com_vendor: `vendor-${vendor_id}`,
              vtrxn_voucher: voucherNo,
              vtrxn_amount: Math.abs(vendor_balance),
              vtrxn_created_at: new Date(),
              vtrxn_note: `Opening balance entry for ${vendor.vendor_name}`,
              vtrxn_particular_id: 31,
              vtrxn_type: vendor_balance < 0 ? 'CREDIT' : 'DEBIT',
              vtrxn_pay_type: 'OPENING_BALANCE',
            });

            console.log('✅ Vendor transaction inserted successfully!');
          } catch (error) {
            console.error('❌ Vendor transaction insert failed:', error);
          }
        } catch (err: any) {
          console.error('Vendor Migration failed:', vendor.vendor_id);

          failedCount++;
          const errorMessage = err?.message || 'Unknown error';

          failedRecords.push({
            vendor_id: vendor.vendor_id,
            reason: errorMessage.includes('Duplicate entry')
              ? 'Duplicate entry'
              : errorMessage,
          });
        }
      }

      return {
        code:
          failedCount === 0
            ? this.StatusCode.HTTP_OK
            : this.StatusCode.HTTP_PARTIAL_CONTENT,
        success: failedCount === 0,
        migrated: {
          total: getSingleEntryVendor.length,
          success: successCount,
          failed: failedCount,
          failedRecords,
        },
      };
    } catch (error) {
      console.error('Error in moveVendors:', error);
      throw error;
    }
  }

  public async moveEmployees(req: Request) {
    const model = this.Model.agentDashboardModel(); // Get the property model

    const getSingleEntryVendor = await model.getSingleEntryEmployee(76);
    const getDoubleEntryClient = await model.getDoubleEntryEmployee(154);

    const columnSingleInfo: any = await model.columnSingleEmployee();
    const columnDoubleInfo: any = await model.columnDoubleEmployee();

    const columnSingle = Object.keys(columnSingleInfo);
    const columnDouble = Object.keys(columnDoubleInfo);

    const commonColumns = columnSingle.filter((column) =>
      columnDouble.includes(column)
    );

    console.log(commonColumns);

    // const newColumn = 'client_code';

    // commonColumns.push(newColumn);
    // console.log({ commonColumns });

    for (const client of getSingleEntryVendor) {
      const transformedClient: Record<string, any> = {};

      for (const column of commonColumns) {
        if (column === 'employee_id') continue;
        transformedClient[column] = client[column];

        if (column === 'employee_org_agency') {
          transformedClient[column] = 154;
        }

        // if (column === 'client_code') {
        //   transformedClient['client_code'] = client['client_entry_id'];
        // }

        if (column === 'employee_created_by') {
          transformedClient[column] = 126;
        }

        if (column === 'employee_updated_by') {
          transformedClient[column] = null;
        }

        if (column === 'employee_designation_id') {
          transformedClient[column] = null;
        }
        if (column === 'employee_department_id') {
          transformedClient[column] = null;
        }
      }

      await model.insertDoubleEntryEmployee(transformedClient);
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      // single: getSingleEntryClient,
      // double: getDoubleEntryClient,
    };
  }
  public async moveUsers(req: Request) {
    const model = this.Model.agentDashboardModel();

    // single_entry (source) agency_id = 76
    // double_entry (target) agency_id = 154
    const singleAgencyId = 76;
    const doubleAgencyId = 154;

    // Step 1: Fetch single_entry & double_entry user data
    const getSingleEntryUsers = await model.getSingleEntryUsers(singleAgencyId);
    const getDoubleEntryUsers = await model.getDoubleEntryUsers(doubleAgencyId);

    // Step 2: Fetch column info
    const columnSingleInfo: any = await model.columnSingleUsers();
    const columnDoubleInfo: any = await model.columnDoubleUsers();

    const columnSingle = Object.keys(columnSingleInfo);
    const columnDouble = Object.keys(columnDoubleInfo);

    // Step 3: Find common columns
    const commonColumns = columnSingle.filter((col) =>
      columnDouble.includes(col)
    );

    console.log('Common columns:', commonColumns);

    // Step 4: Loop through each user record and transform
    for (const user of getSingleEntryUsers) {
      const transformedUser: Record<string, any> = {};

      for (const column of commonColumns) {
        if (column === 'user_id') continue; // Skip PK

        transformedUser[column] = user[column];

        // Agency shift
        if (column === 'user_agency_id') {
          transformedUser[column] = doubleAgencyId;
        }

        if (column === 'user_role_id') {
          transformedUser[column] = 1;
        }

        // Fix creator
        if (column === 'user_created_by') {
          transformedUser[column] = 126; // Admin ID for example
        }

        // Clear socket/status for fresh start
        if (column === 'socket_id') {
          transformedUser[column] = null;
        }

        if (column === 'status') {
          transformedUser[column] = 'offline';
        }

        // Role mapping adjustment (optional)
        if (column === 'user_role') {
          const roleMap: any = {
            DEV_ADMIN: 'SUPER_ADMIN',
            SUPER_ADMIN: 'SUPER_ADMIN',
            ADMIN: 'ADMIN',
            ACCOUNT: 'EMPLOYEE',
            EMPLOYEE: 'EMPLOYEE',
          };
          transformedUser[column] = roleMap[user[column]] || 'EMPLOYEE';
        }
      }

      // Step 5: Insert into double_entry users table
      await model.insertDoubleEntryUsers(transformedUser);
    }

    return {
      success: true,
      message: 'User data migrated successfully',
      code: this.StatusCode.HTTP_OK,
    };
  }

  public async moveAccounts(req: Request) {
    const model = this.Model.agentDashboardModel();

    const getSingleAccounts = await model.getSingleEntryAccounts();

    const accHeads: any = {
      CASH: {
        head_parent_id: 3,
        head_code: '1001.002',
        head_group_code: '1000',
      },
      BANK: {
        head_parent_id: 5,
        head_code: '1001.003',
        head_group_code: '1000',
      },
      CHEQUE: { head_parent_id: 5, head_code: '', head_group_code: '' },
      MOBILE_BANKING: {
        head_parent_id: 6,
        head_code: '1001.004',
        head_group_code: '1000',
      },
    };

    for (const account of getSingleAccounts) {
      // Determine account type
      const accountType =
        account.account_acctype_id === 1
          ? 'CASH'
          : account.account_acctype_id === 2
          ? 'BANK'
          : account.account_acctype_id === 3
          ? 'MOBILE_BANKING'
          : 'UNKNOWN';

      // Prepare base body
      const accountBody = {
        account_type: accountType,
        account_name: account.account_name,
        account_opening_balance_type: 'SALES',
        account_number: account.account_number,
        account_bank_name: account.account_bank_name,
        account_branch_name: account.account_branch_name,
        account_routing_no: account.account_routing_no,
        account_created_by: 1666,
        account_org_agency: 154,
      };

      // Determine opening balance and type (positive or negative)
      let opening_balance = 0;
      let opening_balance_type: 'DEBIT' | 'CREDIT' = 'DEBIT';

      if (account.account_lbalance > 0) {
        opening_balance = account.account_lbalance;
        opening_balance_type = 'DEBIT';
      } else if (account.account_lbalance < 0) {
        opening_balance = Math.abs(account.account_lbalance);
        opening_balance_type = 'CREDIT';
      }

      // Determine account head mapping
      const accountHeadType =
        account.account_acctype_id === 1
          ? 'CASH'
          : account.account_acctype_id === 2
          ? 'BANK'
          : account.account_acctype_id === 3
          ? 'MOBILE_BANKING'
          : '';

      const { head_code, head_group_code, head_parent_id } =
        accHeads[accountHeadType];

      // Prepare head payload
      const headPayload = {
        head_name: account.account_name,
        head_parent_id,
        head_code: '',
        head_agency_id: 154,
        head_created_by: 1666,
        head_group_code,
      };

      // Generate head code
      const lastHead = await model.getLastHeadCodeByParent(head_parent_id);
      headPayload.head_code = lastHead
        ? generateNextGroupCode(lastHead)
        : `${head_code}.001`;

      // Insert head and get ID
      account.account_head_id = await model.insertAccHead(headPayload);

      // === Prepare Vouchers (Opening Balance Migration) ===
      const voucherNo = `OPEN-${account.account_head_id}`;

      if (opening_balance_type === 'DEBIT') {
        // Dr Balance
        await model.insertAccVoucherDb({
          serial_no: 1,
          acc_head_id: account.account_head_id,
          voucher_no: voucherNo,
          amount: opening_balance,
          trans_type: 'DEBIT',
          description: `Opening debit balance for ${account.account_name}`,
          payment_type: 'OPENING_BALANCE',
        });

        await model.insertAccVoucherDb({
          serial_no: 2,
          acc_head_id: this.accHead['Opening Balance Difference A/c'],
          voucher_no: voucherNo,
          amount: opening_balance,
          trans_type: 'CREDIT',
          description: `Opening debit adjustment for ${account.account_name}`,
          payment_type: 'OPENING_BALANCE',
        });
      } else {
        await model.insertAccVoucherDb({
          serial_no: 1,
          acc_head_id: this.accHead['Opening Balance Difference A/c'],
          voucher_no: voucherNo,
          amount: opening_balance,
          trans_type: 'DEBIT',
          description: `Opening credit adjustment for ${account.account_name}`,
          payment_type: 'OPENING_BALANCE',
        });
        // Cr Balance
        await model.insertAccVoucherDb({
          serial_no: 2,
          acc_head_id: account.account_head_id,
          voucher_no: voucherNo,
          amount: opening_balance,
          trans_type: 'CREDIT',
          description: `Opening credit balance for ${account.account_name}`,
          payment_type: 'OPENING_BALANCE',
        });
      }

      // === Final payload ===
      const accountPayload = {
        ...accountBody,
        account_head_id: account.account_head_id,
        account_opening_balance_type: opening_balance_type,
        account_org_agency: 154,
      };

      console.log('✅ Migrated Account:', {
        name: account.account_name,
        balance: opening_balance,
        type: opening_balance_type,
      });

      await model.insertAccount(accountPayload);
    }

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      message: 'All accounts migrated successfully with opening balances',
    };
  }

  // Function to format the date
  public async invoices(req: Request) {
    const model = this.Model.agentDashboardModel(); // Get the property model

    // const items = await model.singleEntryInvoicesAirTicketItems();

    return await this.db.transaction(async (trx) => {
      // const invoice_part = {
      //   invoice_combclient_id: `client-${data.invoice_client_id}`, // Use backticks for template literals
      //   // client_name: 'Kashi Bencho',
      //   // invoice_customer_name: 'Kashi Bencho',
      //   invoice_org_agency: 76,
      //   invoice_no: 'HelloWorld12354',
      //   invoice_sales_man_id: data.invoice_sales_man_id,
      //   invoice_sales_date: formatDate(data.invoice_sales_date), // Format the date
      //   invoice_sub_total: data.invoice_sub_total,
      //   invoice_agent_id: null,
      //   invoice_agent_commission: 0,
      //   invoice_show_passport_details: 0,
      //   invoice_show_prev_due: data.invoice_client_previous_due,
      //   invoice_show_unit: 1,
      //   invoice_show_discount: 1,
      //   invoice_note: data.invoice_note,
      //   tickets: [
      //     {
      //       // airticket_id: items[0].airticket_id,
      //       // airticket_invoice_id: items[0].airticket_invoice_id,
      //       airticket_org_agency: 154,
      //       airticket_ticket_type: items[0].airticket_ticket_type,
      //       airticket_classes: items[0].airticket_classes,
      //       airticket_ticket_no: items[0].airticket_ticket_no,
      //       airticket_emd_remarks: items[0].airticket_emd_remarks,
      //       airticket_gross_fare: items[0].airticket_gross_fare,
      //       airticket_base_fare: items[0].airticket_base_fare,
      //       airticket_comvendor: items[0]?.airticket_vendor_id
      //         ? `vendor-${items[0].airticket_vendor_id}`
      //         : items[0]?.airticket_vendor_combine_id
      //         ? `combine-${items[0].airticket_vendor_combine_id}`
      //         : items[0]?.airticket_comvendor,
      //       vendor_name: 'Shamim Al Mamon',
      //       airticket_airline_id: items[0].airticket_airline_id,
      //       airticket_commission_percent: items[0].airticket_commission_percent,
      //       airticket_discount_total: items[0].airticket_discount_total,
      //       airticket_extra_fee: items[0].airticket_extra_fee,
      //       airticket_pnr: items[0].airticket_pnr,
      //       airticket_bd_charge: items[0].airticket_bd_charge,
      //       airticket_es_charge: items[0].airticket_es_charge,
      //       airticket_ut_charge: items[0].airticket_ut_charge,
      //       airticket_xt_charge: items[0].airticket_xt_charge,
      //       airticket_e5_charge: items[0].airticket_e5_charge,
      //       airticket_g4_charge: items[0].airticket_g4_charge,
      //       airticket_ow_charge: items[0].airticket_ow_charge,
      //       airticket_p7_charge: items[0].airticket_p7_charge,
      //       airticket_p8_charge: items[0].airticket_p8_charge,
      //       airticket_pz_charge: items[0].airticket_pz_charge,
      //       airticket_qa_charge: items[0].airticket_qa_charge,
      //       airticket_r9_charge: items[0].airticket_r9_charge,
      //       airticket_gds_id: 1,
      //       airticket_segment: 0,
      //       airticket_journey_date: items[0].airticket_journey_date,
      //       airticket_return_date: items[0].airticket_return_date,
      //       passport_id: items[0].airticket_passport_id,
      //       passport_no: 'P0292292922',
      //       passport_name: 'MOHAMMAD SHAMIM AL MAMON',
      //       passport_person_type: 'Adult',
      //       passport_email: 'nazmul.m360ict@gmail.com',
      //       passport_mobile_no: '01888798798',
      //       passport_date_of_birth: '1975-07-03T18:00:00.000Z',
      //       passport_date_of_expire: '2031-11-01T00:00:00.000Z',
      //       airticket_route_or_sector: ['DAC', 'CXB', 'DAC'],
      //       taxes_commission: [
      //         {
      //           airline_commission: 18,
      //           airline_taxes: 250,
      //           airline_tax_type: 'YQ',
      //         },
      //         {
      //           airline_commission: 4,
      //           airline_tax_type: 'YR',
      //           airline_taxes: 50,
      //         },
      //       ],
      //       flight_details: [
      //         {
      //           fltdetails_from_airport_id: 358,
      //           fltdetails_to_airport_id: 394,
      //           fltdetails_airline_id: 109,
      //           fltdetails_flight_no: 713,
      //           fltdetails_fly_date: '2024-10-23',
      //           fltdetails_departure_time: '14:38:41',
      //           fltdetails_arrival_time: '14:38:43',
      //         },
      //       ],
      //     },
      //   ],
      // };
      const data = await model.singleEntryInvoices();

      const invoices = [];

      for (const itemData of data) {
        const ticketItems = await model.singleEntryInvoicesAirTicketItems(
          itemData.invoice_id
        );

        const invoice_part = {
          invoice_combclient_id: `client-${itemData.invoice_client_id}`,
          invoice_org_agency: 76,
          invoice_no: 'HelloWorld12354',
          invoice_sales_man_id: itemData.invoice_sales_man_id,
          invoice_sales_date: formatDate(itemData.invoice_sales_date),
          invoice_sub_total: itemData.invoice_sub_total,
          invoice_agent_id: null,
          invoice_agent_commission: 0,
          invoice_show_passport_details: 0,
          invoice_show_prev_due: itemData.invoice_client_previous_due,
          invoice_show_unit: 1,
          invoice_show_discount: 1,
          invoice_note: itemData.invoice_note,
          tickets: ticketItems.map((ticket) => ({
            airticket_org_agency: 154,
            airticket_ticket_type: ticket.airticket_ticket_type || null,
            airticket_classes: ticket.airticket_classes,
            airticket_ticket_no: ticket.airticket_ticket_no,
            airticket_emd_remarks: ticket.airticket_emd_remarks,
            airticket_gross_fare: ticket.airticket_gross_fare,
            airticket_base_fare: ticket.airticket_base_fare,
            airticket_comvendor: ticket?.airticket_vendor_id
              ? `vendor-${ticket.airticket_vendor_id}`
              : ticket?.airticket_vendor_combine_id
              ? `combine-${ticket.airticket_vendor_combine_id}`
              : ticket?.airticket_comvendor,
            // vendor_name: 'Shamim Al Mamon',
            airticket_airline_id: ticket.airticket_airline_id,
            airticket_commission_percent: ticket.airticket_commission_percent,
            airticket_discount_total: ticket.airticket_discount_total,
            airticket_extra_fee: ticket.airticket_extra_fee,
            airticket_pnr: ticket.airticket_pnr,
            airticket_bd_charge: ticket.airticket_bd_charge,
            airticket_es_charge: ticket.airticket_es_charge,
            airticket_ut_charge: ticket.airticket_ut_charge,
            airticket_xt_charge: ticket.airticket_xt_charge,
            airticket_e5_charge: ticket.airticket_e5_charge,
            airticket_g4_charge: ticket.airticket_g4_charge,
            airticket_ow_charge: ticket.airticket_ow_charge,
            airticket_p7_charge: ticket.airticket_p7_charge,
            airticket_p8_charge: ticket.airticket_p8_charge,
            airticket_pz_charge: ticket.airticket_pz_charge,
            airticket_qa_charge: ticket.airticket_qa_charge,
            airticket_r9_charge: ticket.airticket_r9_charge,
            airticket_gds_id: 1,
            airticket_segment: 0,
            airticket_journey_date: ticket.airticket_journey_date,
            airticket_return_date: ticket.airticket_return_date,
            passport_id: ticket.airticket_passport_id,
            passport_no: 'P0292292922',
            passport_name: 'MOHAMMAD SHAMIM AL MAMON',
            passport_person_type: 'Adult',
            passport_email: 'nazmul.m360ict@gmail.com',
            passport_mobile_no: '01888798798',
            passport_date_of_birth: '1975-07-03T18:00:00.000Z',
            passport_date_of_expire: '2031-11-01T00:00:00.000Z',
            airticket_route_or_sector: ['DAC', 'CXB', 'DAC'],
            taxes_commission: [
              {
                airline_commission: 18,
                airline_taxes: 250,
                airline_tax_type: 'YQ',
              },
              {
                airline_commission: 4,
                airline_tax_type: 'YR',
                airline_taxes: 50,
              },
            ],
            flight_details: [
              {
                fltdetails_from_airport_id: 358,
                fltdetails_to_airport_id: 394,
                fltdetails_airline_id: 109,
                fltdetails_flight_no: 713,
                fltdetails_fly_date: '2024-10-23',
                fltdetails_departure_time: '14:38:41',
                fltdetails_arrival_time: '14:38:43',
              },
            ],
          })),
        };

        invoices.push(invoice_part);
      }

      for (const invoice of invoices) {
        try {
          const { invoicePayload, ticketsFormat, client_name } =
            await airTicketPayloadFormatter(invoice, '');

          const invoiceModel = this.Model.agentDashboardModel(trx);
          const invoiceId = await invoiceModel.insertInvoicesInfo(
            invoicePayload
          );

          for (const ticket of ticketsFormat) {
            const {
              airTicketDetails,
              flightDetails,
              passportDetails,
              clTransPayload,
              VTransPayload,
              taxes_commission,
              vendor_name,
            } = ticket;

            const { airticket_id, airticket_is_deleted, ...restAirTicket } =
              airTicketDetails;

            const ac_sale_vou1 = await invoiceModel.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
              voucher_no: `Sales-${invoiceId}`,
              amount: restAirTicket.airticket_client_price,
              trans_type: 'DEBIT',
              description: `Ticket sale to ${client_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_sale_vou2 = await invoiceModel.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id: this.accHead['Air Ticket(Sales)'],
              voucher_no: `Sales-${invoiceId}`,
              amount: restAirTicket.airticket_client_price,
              trans_type: 'CREDIT',
              description: `Ticket sale to ${client_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_pur_vou1 = await invoiceModel.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id: this.accHead['Air Ticket(Purchase)'],
              voucher_no: `Purchase-${invoiceId}`,
              amount: restAirTicket.airticket_purchase_price,
              trans_type: 'DEBIT',
              description: `Purchase ticket from ${vendor_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_pur_vou2 = await invoiceModel.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
              voucher_no: `Purchase-${invoiceId}`,
              amount: restAirTicket.airticket_purchase_price,
              trans_type: 'CREDIT',
              description: `Purchase ticket from ${vendor_name} on account`,
              payment_type: 'INVOICE',
            });

            const clTrans = await invoiceModel.insertClientTrans({
              ...clTransPayload,
              ctrxn_voucher: `ClientTrans-${invoiceId}`,
              ctrxn_created_date: invoicePayload.invoice_sales_date,
              ctrxn_ref_id: invoiceId,
            });

            const vTrans = await invoiceModel.insertVendorTrans({
              ...VTransPayload,
              vtrxn_voucher: `VendorTrans-${invoiceId}`,
              vtrxn_ref_id: invoiceId,
            });

            const airTicketItemPayload = {
              ...restAirTicket,
              airticket_cl_com_trans_id: clTrans.clComTransId,
              airticket_cl_trans_id: clTrans.clTransId,
              airticket_invoice_id: invoiceId,
              airticket_org_agency: 154,
              airticket_v_com_trans_id: vTrans.vendorComTransId,
              airticket_v_trans_id: vTrans.vendorTransId,
              airticket_ac_sale_vou1: ac_sale_vou1,
              airticket_ac_sale_vou2: ac_sale_vou2,
              airticket_ac_pur_vou1: ac_pur_vou1,
              airticket_ac_pur_vou2: ac_pur_vou2,
            };

            const airTicketId = await invoiceModel.insertAirTicketItem(
              airTicketItemPayload
            );

            if (passportDetails && passportDetails?.p_passport_no) {
              await invoiceModel.insertAirTicketPax({
                ...passportDetails,
                p_airticket_id: airTicketId,
                p_invoice_id: invoiceId,
              });
            }

            if (flightDetails && flightDetails[0].fltdetails_from_airport_id) {
              const flightsDetails: IFlightDetailsDb[] = flightDetails?.map(
                (item: any) => {
                  return {
                    ...item,
                    fltdetails_airticket_id: airTicketId,
                    fltdetails_invoice_id: invoiceId,
                  };
                }
              );

              await invoiceModel.insertAirTicketFlights(flightsDetails);
            }

            if (taxes_commission && taxes_commission[0]?.airline_tax_type) {
              const taxesCommission = taxes_commission?.map((item: any) => {
                return {
                  ...item,
                  airline_airticket_id: airTicketId,
                  airline_invoice_id: invoiceId,
                };
              });

              await invoiceModel.insertAirTicketCommission(taxesCommission);
            }
          }
        } catch (error) {
          console.error('Error processing invoice:', error);
        }
      }

      return {
        success: true,
        code: this.StatusCode.HTTP_OK,
        data: invoices,
      };
    });
  }

  public async testInvoices(req: Request) {
    const model = this.Model.agentDashboardModel();

    const data = await model.singleEntryInvoices();

    const invoices: any = [];

    for (const itemData of data) {
      const ticketItems = await model.singleEntryInvoicesAirTicketItemsV4(
        itemData.invoice_id
      );

      const employeeInfo = await model.getEmployeeInfoAndId(
        itemData.invoice_sales_man_id
      );
      const clientInfo = await model.getSingleClientInfo(
        itemData.invoice_client_id
      );

      const userName = await model.getUserInfoAndId(
        itemData.invoice_created_by
      );

      const invoice_part_two = {
        invoice_combclient_id: `client-${clientInfo?.doubleClientId}`,
        clientCode: clientInfo?.clientCode,
        salesMan: employeeInfo?.doubleEmployeeId,
        salesManname: employeeInfo?.employeeConn,
        invoice_sales_date: formatDate(itemData.invoice_sales_date),
        invoice_created_by: userName.doubleUserId,
        created_by: userName.userConn,
        tickets: await Promise.all(
          ticketItems.map(async (ticket) => {
            // Fetch flight details dynamically for each ticket
            const flightDetails: any = await model.singleFlight(
              ticket.airticket_id
            );

            const airlineName = await model.getAirlineInfo(
              ticket.airticket_airline_id
            );

            // const vendor = await model.getVendorInfo(
            //   ticket?.airticket_vendor_id
            // );

            const singleVendor: any = await model.getSingleEntryVendorInfo(
              ticket.airticket_vendor_id
            );

            const taxDetails: any = await model.singleTax(ticket.airticket_id);

            const passportDetails: any = await model.singlePassport(
              itemData.invoice_id,
              ticket.airticket_id
            );
            const getAirlineId = await model.getAirlineInfoAndId(
              ticket.airticket_airline_id
            );
            return {
              airticket_ticket_type: ticket.airticket_ticket_type,
              airticket_classes: ticket.airticket_classes,
              airticket_client_id: clientInfo?.doubleClientId,
              ticket_no: ticket.airticket_ticket_no,
              airticket_emd_remarks: ticket.airticket_emd_remarks,
              airticket_gross_fare: ticket.airticket_gross_fare,
              airticket_base_fare: ticket.airticket_base_fare,
              airticket_comvendor: singleVendor.vendor_id
                ? `vendor-${singleVendor.vendor_id}`
                : ticket?.airticket_vendor_combine_id
                ? `combine-${ticket.airticket_vendor_combine_id}`
                : ticket?.airticket_comvendor,
              vendor: singleVendor?.vendor,
              vendor_name: singleVendor?.vendor_name,
              airline: airlineName,
              // getAirlineId: getAirlineId,
              airticket_airline_id: getAirlineId.doubleAirlineId,
              airticket_commission_percent: ticket.airticket_commission_percent,
              airticket_discount_total: ticket.airticket_discount_total,
              airticket_extra_fee: ticket.airticket_extra_fee,
              airticket_pnr: ticket.airticket_pnr,
              airticket_bd_charge: ticket.airticket_bd_charge,
              airticket_es_charge: ticket.airticket_es_charge,
              airticket_ut_charge: ticket.airticket_ut_charge,
              airticket_xt_charge: ticket.airticket_xt_charge,
              airticket_e5_charge: ticket.airticket_e5_charge,
              airticket_g4_charge: ticket.airticket_g4_charge,
              airticket_ow_charge: ticket.airticket_ow_charge,
              airticket_p7_charge: ticket.airticket_p7_charge,
              airticket_p8_charge: ticket.airticket_p8_charge,
              airticket_pz_charge: ticket.airticket_pz_charge,
              airticket_qa_charge: ticket.airticket_qa_charge,
              airticket_r9_charge: ticket.airticket_r9_charge,
              airticket_gds_id: ticket.airticket_gds_id,
              airticket_vat: ticket.airticket_vat,
              airticket_segment: ticket.airticket_segment,
              airticket_journey_date: ticket.airticket_journey_date,
              airticket_return_date: ticket.airticket_return_date,
              airticket_route_or_sector: ticket.airticket_routes,
              airticket_is_reissued: ticket.airticket_is_reissued,
              airticket_is_refund: ticket.airticket_is_refund,
              airticket_is_void: ticket.airticket_is_void,
              passport_id: passportDetails?.p_passport_id || null,
              passport_no: passportDetails?.p_passport_no || null,
              passport_name: passportDetails?.p_passport_name || null,
              passport_person_type: passportDetails?.p_passport_type || null,
              passport_email: passportDetails?.p_email || null,
              passport_mobile_no: passportDetails?.p_mobile_no || null,
              flight_details: flightDetails
                ? await Promise.all(
                    flightDetails.map(async (flight: any) => {
                      const fromAirportName = await model.getAirportInfo(
                        flight.fltdetails_from_airport_id
                      );
                      const toAirportName = await model.getAirportInfo(
                        flight.fltdetails_to_airport_id
                      );
                      const airline = await model.getAirlineInfoAndId(
                        flight.fltdetails_airline_id
                      );
                      return {
                        from_airport_id: fromAirportName.doubleAirportId,
                        to_airport_id: toAirportName.doubleAirportId,
                        airline_id: airline.doubleAirlineId,
                        fltdetails_flight_no: flight.fltdetails_flight_no,
                        fltdetails_fly_date: flight.fltdetails_fly_date,
                        fltdetails_departure_time:
                          flight.fltdetails_departure_time,
                        fltdetails_arrival_time: flight.fltdetails_arrival_time,
                      };
                    })
                  )
                : [],

              taxes_commission: taxDetails
                ? taxDetails.map((tax: any) => ({
                    airline_commission: tax.airline_commission,
                    airline_taxes: tax.airline_taxes,
                    airline_tax_type: tax.airline_tax_type,
                  }))
                : [],
            };
          })
        ),
      };

      // "success": false,
      // "message": "Cannot read properties of undefined (reading 'employee_full_name')",
      invoices.push(invoice_part_two);
    }

    // return {
    //   success: true,
    //   code: this.StatusCode.HTTP_OK,
    //   data: invoices.filter(
    //     (invoice: any) => invoice.tickets && invoice.tickets.length > 0
    //   ),
    // };

    return await this.db.transaction(async (trx) => {
      const processingErrors: Array<{
        invoice: any;
        error: string;
        errorType?: string;
      }> = [];
      let successCount = 0;
      let errorCount = 0;
      for (const invoice of invoices) {
        try {
          const { invoicePayload, ticketsFormat, client_name } =
            await airTicketPayloadFormatter(invoice, '');

          const invoice_no = await this.superVoucher(req, 'AIT');

          const invoiceModel = this.Model.agentDashboardModel(trx);
          const invoiceId = await invoiceModel.insertInvoicesInfo({
            ...invoicePayload,
            invoice_org_agency: 154,
            invoice_created_by: invoice.invoice_created_by,
            invoice_sales_man_id: invoice.salesMan,
            invoice_show_discount: 0,
            invoice_show_prev_due: 0,
            invoice_no,
          });

          const clientNameGet = await invoiceModel.getClientName(
            Number(invoicePayload.invoice_client_id)
          );

          for (const ticket of ticketsFormat) {
            const {
              airTicketDetails,
              flightDetails,
              passportDetails,
              clTransPayload,
              VTransPayload,
              taxes_commission,
              vendor_name,
            } = ticket;

            const { airticket_id, airticket_is_deleted, ...restAirTicket } =
              airTicketDetails;

            const vendorNameGet = await invoiceModel.getVendorName(
              Number(ticket.airTicketDetails.airticket_vendor_id)
            );

            const ac_sale_vou1 = await invoiceModel.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
              voucher_no: `Sales-${invoiceId}`,
              amount: restAirTicket.airticket_client_price,
              trans_type: 'DEBIT',
              description: `Ticket sale to ${clientNameGet.client_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_sale_vou2 = await invoiceModel.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id: this.accHead['Air Ticket(Sales)'],
              voucher_no: `Sales-${invoiceId}`,
              amount: restAirTicket.airticket_client_price,
              trans_type: 'CREDIT',
              description: `Ticket sale to ${clientNameGet.client_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_pur_vou1 = await invoiceModel.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id: this.accHead['Air Ticket(Purchase)'],
              voucher_no: `Purchase-${invoiceId}`,
              amount: restAirTicket.airticket_purchase_price,
              trans_type: 'DEBIT',
              description: `Purchase ticket from ${vendorNameGet.vendor_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_pur_vou2 = await invoiceModel.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
              voucher_no: `Purchase-${invoiceId}`,
              amount: restAirTicket.airticket_purchase_price,
              trans_type: 'CREDIT',
              description: `Purchase ticket from ${vendorNameGet.vendor_name} on account`,
              payment_type: 'INVOICE',
            });

            const clTrans = await invoiceModel.insertClientTrans({
              ...clTransPayload,
              ctrxn_voucher: invoice_no,
              // ctrxn_voucher: `ClientTrans-${invoiceId}`,
              ctrxn_created_date: invoicePayload.invoice_sales_date,
              ctrxn_ref_id: invoiceId,
            });

            const vTrans = await invoiceModel.insertVendorTrans({
              ...VTransPayload,
              vtrxn_voucher: invoice_no,
              vtrxn_created_date: invoicePayload.invoice_sales_date,
              // vtrxn_voucher: `VendorTrans-${invoiceId}`,
              vtrxn_ref_id: invoiceId,
            });

            const airTicketItemPayload = {
              ...restAirTicket,
              airticket_cl_com_trans_id: clTrans.clComTransId,
              airticket_cl_trans_id: clTrans.clTransId,
              airticket_invoice_id: invoiceId,
              airticket_org_agency: 154,
              airticket_v_com_trans_id: vTrans.vendorComTransId,
              airticket_v_trans_id: vTrans.vendorTransId,
              airticket_ac_sale_vou1: ac_sale_vou1,
              airticket_ac_sale_vou2: ac_sale_vou2,
              airticket_ac_pur_vou1: ac_pur_vou1,
              airticket_ac_pur_vou2: ac_pur_vou2,
            };

            const airTicketId = await invoiceModel.insertAirTicketItem(
              airTicketItemPayload
            );

            if (passportDetails) {
              await invoiceModel.insertAirTicketPax({
                p_passport_id: passportDetails?.p_passport_id,
                p_passport_no: passportDetails?.p_passport_no,
                p_passport_name: passportDetails?.p_passport_name,
                p_passport_type: passportDetails?.p_passport_type,
                p_email: passportDetails?.p_email,
                p_mobile_no: passportDetails?.p_mobile_no,
                p_airticket_id: airTicketId,
                p_invoice_id: invoiceId,
              });
            }

            if (flightDetails) {
              const flightsDetails: IFlightDetailsDb[] = flightDetails?.map(
                (item: any) => {
                  return {
                    fltdetails_from_airport_id: item.from_airport_id
                      ? item.from_airport_id
                      : null,
                    fltdetails_to_airport_id: item.to_airport_id
                      ? item.to_airport_id
                      : null,
                    fltdetails_airline_id: item.airline_id
                      ? item.airline_id
                      : null,
                    fltdetails_flight_no: item.fltdetails_flight_no || null,
                    fltdetails_fly_date: item.fltdetails_fly_date || null,
                    fltdetails_arrival_time:
                      item.fltdetails_arrival_time || null,
                    fltdetails_departure_time:
                      item.fltdetails_departure_time || null,
                    fltdetails_airticket_id: airTicketId,
                    fltdetails_invoice_id: invoiceId,
                  };
                }
              );

              if (flightsDetails && flightsDetails.length > 0) {
                await invoiceModel.insertAirTicketFlights(flightsDetails);
              }
            }

            if (taxes_commission) {
              const taxesCommission = taxes_commission?.map((item: any) => {
                return {
                  airline_commission: item.airline_commission || 0,
                  airline_taxes: item.airline_taxes || 0,
                  airline_tax_type: item.airline_tax_type || 0,
                  airline_airticket_id: airTicketId,
                  airline_invoice_id: invoiceId,
                };
              });
              if (taxes_commission && taxes_commission.length > 0) {
                await invoiceModel.insertAirTicketCommission(taxesCommission);
              }
            }
          }
          // await this.updateVoucher(req, 'AIT');

          //content and history data must be added there
        } catch (error) {
          errorCount++;
          console.error('Error processing invoice:', error);

          // Extract error type from the error message or object
          let errorType = 'Unknown';
          if (error instanceof Error) {
            if (error.message.includes('trabill_invoices')) {
              errorType = 'Database Insert Error';
            } else if (error.message.includes('validation')) {
              errorType = 'Validation Error';
            }
            // Add more error type checks as needed
          }

          processingErrors.push({
            invoice: invoice, // or invoice.id if available
            error: error instanceof Error ? error.message : String(error),
            errorType: errorType,
          });
        }
      }
      return {
        success: errorCount === 0,
        code:
          errorCount === 0
            ? this.StatusCode.HTTP_OK
            : this.StatusCode.HTTP_PARTIAL_CONTENT,
        data: {
          totalInvoices: invoices.length,
          processedSuccessfully: successCount,
          failedToProcess: errorCount,
          invoices: invoices,
        },
        errors: processingErrors,
        errorSummary: {
          totalErrors: errorCount,
          errorTypes: processingErrors.reduce((acc, err) => {
            acc[err.errorType || 'Unknown'] =
              (acc[err.errorType || 'Unknown'] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
      };
    });
  }
  public async testInvoicesReissues(req: Request) {
    const model = this.Model.agentDashboardModel();

    const data = await model.singleEntryInvoicesReissueNew();

    const invoices: any = [];

    for (const itemData of data) {
      const ticketItems =
        await model.singleEntryInvoicesAirTicketItemsWithReissued(
          itemData.invoice_id
        );

      const employeeInfo = await model.getSingleEntryEmployeeInfo(
        itemData.invoice_sales_man_id
      );
      const clientInfo = await model.getSingleClientInfo(
        itemData.invoice_client_id
      );

      // const invoice_part = {
      //   invoice_combclient_id: `client-${clientInfo?.doubleClientId}`,
      //   invoice_org_agency: 154,
      //   invoice_no: 'HelloWorld12354',
      //   invoice_sales_man_id: employeeInfo?.doubleEmployeeId,
      //   invoice_sales_date: formatDate(itemData.invoice_sales_date),
      //   invoice_sub_total: itemData.invoice_sub_total,
      //   invoice_agent_id: null,
      //   invoice_agent_commission: 0,
      //   invoice_show_passport_details: 0,
      //   invoice_show_prev_due: itemData.invoice_client_previous_due,
      //   invoice_show_unit: 1,
      //   invoice_show_discount: 1,
      //   invoice_note: itemData.invoice_note,
      //   tickets: await Promise.all(
      //     ticketItems.map(async (ticket) => {
      //       // Fetch flight details dynamically for each ticket
      //       const flightDetails: any = await model.singleFlight(
      //         ticket.airticket_id
      //       );

      //       //get single vendor //ticket.airticket_vendor_id

      //       const singleVendor: any = await model.getSingleEntryVendorInfo(
      //         ticket.airticket_vendor_id
      //       );

      //       const taxDetails: any = await model.singleTax(ticket.airticket_id);

      //       const passportDetails: any = await model.singlePassport(
      //         itemData.invoice_id,
      //         ticket.airticket_id
      //       );

      //       return {
      //         airticket_org_agency: 154,
      //         airticket_ticket_type: ticket.airticket_ticket_type,
      //         airticket_classes: ticket.airticket_classes,
      //         airticket_ticket_no: ticket.airticket_ticket_no,
      //         airticket_emd_remarks: ticket.airticket_emd_remarks,
      //         airticket_gross_fare: ticket.airticket_gross_fare,
      //         airticket_base_fare: ticket.airticket_base_fare,
      //         airticket_comvendor: singleVendor.vendor_id
      //           ? `vendor-${singleVendor.vendor_id}`
      //           : ticket?.airticket_vendor_combine_id
      //           ? `combine-${ticket.airticket_vendor_combine_id}`
      //           : ticket?.airticket_comvendor,
      //         vendor_name: 'Shamim Al Mamon',
      //         airticket_airline_id: ticket.airticket_airline_id,
      //         airticket_commission_percent: ticket.airticket_commission_percent,
      //         airticket_discount_total: ticket.airticket_discount_total,
      //         airticket_extra_fee: ticket.airticket_extra_fee,
      //         airticket_pnr: ticket.airticket_pnr,
      //         airticket_bd_charge: ticket.airticket_bd_charge,
      //         airticket_es_charge: ticket.airticket_es_charge,
      //         airticket_ut_charge: ticket.airticket_ut_charge,
      //         airticket_xt_charge: ticket.airticket_xt_charge,
      //         airticket_e5_charge: ticket.airticket_e5_charge,
      //         airticket_g4_charge: ticket.airticket_g4_charge,
      //         airticket_ow_charge: ticket.airticket_ow_charge,
      //         airticket_p7_charge: ticket.airticket_p7_charge,
      //         airticket_p8_charge: ticket.airticket_p8_charge,
      //         airticket_pz_charge: ticket.airticket_pz_charge,
      //         airticket_qa_charge: ticket.airticket_qa_charge,
      //         airticket_r9_charge: ticket.airticket_r9_charge,
      //         airticket_gds_id: ticket.airticket_gds_id,
      //         airticket_segment: ticket.airticket_segment,
      //         airticket_journey_date: ticket.airticket_journey_date,
      //         airticket_return_date: ticket.airticket_return_date,
      //         airticket_route_or_sector: ticket.airticket_routes,

      //         passport_id: passportDetails?.p_passport_id || null,
      //         passport_no: passportDetails?.p_passport_no || null,
      //         passport_name: passportDetails?.p_passport_name || null,
      //         passport_person_type: passportDetails?.p_passport_type || null,
      //         passport_email: passportDetails?.p_email || null,
      //         passport_mobile_no: passportDetails?.p_mobile_no || null,

      //         flight_details: flightDetails
      //           ? flightDetails.map((flight: any) => ({
      //               fltdetails_from_airport_id:
      //                 flight.fltdetails_from_airport_id,
      //               fltdetails_to_airport_id: flight.fltdetails_to_airport_id,
      //               fltdetails_airline_id: flight.fltdetails_airline_id,
      //               fltdetails_flight_no: flight.fltdetails_flight_no,
      //               fltdetails_fly_date: flight.fltdetails_fly_date,
      //               fltdetails_departure_time: flight.fltdetails_departure_time,
      //               fltdetails_arrival_time: flight.fltdetails_arrival_time,
      //             }))
      //           : [],

      //         taxes_commission: taxDetails
      //           ? taxDetails.map((tax: any) => ({
      //               airline_commission: tax.airline_commission,
      //               airline_taxes: tax.airline_taxes,
      //               airline_tax_type: tax.airline_tax_type,
      //             }))
      //           : [],
      //       };
      //     })
      //   ),
      // };
      //  "invoice_sales_date": "2023-12-08",
      const invoice_part_two = {
        invoice_combclient_id: `client-${clientInfo?.doubleClientId}`,
        clientCode: clientInfo?.clientCode,
        salesMan: employeeInfo?.employee_full_name,
        invoice_sales_date: formatDate(itemData.invoice_sales_date),
        tickets: await Promise.all(
          ticketItems.map(async (ticket) => {
            // Fetch flight details dynamically for each ticket
            const flightDetails: any = await model.singleFlight(
              ticket.airticket_id
            );

            const airlineName = await model.getAirlineInfo(
              ticket.airticket_airline_id
            );

            const getAirlineId = await model.getAirlineInfoAndId(
              ticket.airticket_airline_id
            );

            // const vendor = await model.getVendorInfo(
            //   ticket?.airticket_vendor_id
            // );

            const singleVendor: any = await model.getSingleEntryVendorInfo(
              ticket.airticket_vendor_id
            );

            const taxDetails: any = await model.singleTax(ticket.airticket_id);

            const passportDetails: any = await model.singlePassport(
              itemData.invoice_id,
              ticket.airticket_id
            );

            return {
              airticket_ticket_type: ticket.airticket_ticket_type,
              airticket_classes: ticket.airticket_classes,
              ticket_no: ticket.airticket_ticket_no,
              airticket_emd_remarks: ticket.airticket_emd_remarks,
              airticket_gross_fare: ticket.airticket_gross_fare,
              airticket_base_fare: ticket.airticket_base_fare,
              airticket_comvendor: singleVendor.vendor_id
                ? `vendor-${singleVendor.vendor_id}`
                : ticket?.airticket_vendor_combine_id
                ? `combine-${ticket.airticket_vendor_combine_id}`
                : ticket?.airticket_comvendor,
              vendor: singleVendor?.vendor,
              vendor_name: singleVendor?.vendor_name,
              airline: airlineName,
              airticket_airline_id: ticket.airticket_airline_id,
              airticket_commission_percent: ticket.airticket_commission_percent,
              airticket_discount_total: ticket.airticket_discount_total,
              airticket_extra_fee: ticket.airticket_extra_fee,
              airticket_pnr: ticket.airticket_pnr,
              getAirline: getAirlineId,
              airticket_bd_charge: ticket.airticket_bd_charge,
              airticket_es_charge: ticket.airticket_es_charge,
              airticket_ut_charge: ticket.airticket_ut_charge,
              airticket_xt_charge: ticket.airticket_xt_charge,
              airticket_e5_charge: ticket.airticket_e5_charge,
              airticket_g4_charge: ticket.airticket_g4_charge,
              airticket_ow_charge: ticket.airticket_ow_charge,
              airticket_p7_charge: ticket.airticket_p7_charge,
              airticket_p8_charge: ticket.airticket_p8_charge,
              airticket_pz_charge: ticket.airticket_pz_charge,
              airticket_qa_charge: ticket.airticket_qa_charge,
              airticket_r9_charge: ticket.airticket_r9_charge,
              airticket_gds_id: ticket.airticket_gds_id,
              airticket_vat: ticket.airticket_vat,
              airticket_segment: ticket.airticket_segment,
              airticket_journey_date: ticket.airticket_journey_date,
              airticket_return_date: ticket.airticket_return_date,
              airticket_route_or_sector: ticket.airticket_routes,
              passport_id: passportDetails?.p_passport_id || null,
              passport_no: passportDetails?.p_passport_no || null,
              passport_name: passportDetails?.p_passport_name || null,
              passport_person_type: passportDetails?.p_passport_type || null,
              passport_email: passportDetails?.p_email || null,
              passport_mobile_no: passportDetails?.p_mobile_no || null,
              flight_details: flightDetails
                ? await Promise.all(
                    flightDetails.map(async (flight: any) => {
                      const fromAirportName = await model.getSingleAirport(
                        flight.fltdetails_from_airport_id
                      );
                      const toAirportName = await model.getSingleAirport(
                        flight.fltdetails_to_airport_id
                      );
                      const airline = await model.getAirlineInfo(
                        flight.fltdetails_airline_id
                      );
                      return {
                        // from_airport_id: fromAirportName,
                        // to_airport_id: toAirportName,
                        // airline_id: airline,
                        from_airport_id: flight.fltdetails_from_airport_id,
                        to_airport_id: flight.fltdetails_to_airport_id,
                        airline_id: flight.fltdetails_airline_id,
                        fltdetails_flight_no: flight.fltdetails_flight_no,
                        fltdetails_fly_date: flight.fltdetails_fly_date,
                        fltdetails_departure_time:
                          flight.fltdetails_departure_time,
                        fltdetails_arrival_time: flight.fltdetails_arrival_time,
                      };
                    })
                  )
                : [],

              taxes_commission: taxDetails
                ? taxDetails.map((tax: any) => ({
                    airline_commission: tax.airline_commission,
                    airline_taxes: tax.airline_taxes,
                    airline_tax_type: tax.airline_tax_type,
                  }))
                : [],
            };
          })
        ),
      };

      // "success": false,
      // "message": "Cannot read properties of undefined (reading 'employee_full_name')",
      invoices.push(invoice_part_two);
    }

    // return {
    //   success: true,
    //   code: this.StatusCode.HTTP_OK,
    //   data: invoices.filter(
    //     (invoice: any) => invoice.tickets && invoice.tickets.length > 0
    //   ),
    // };

    return await this.db.transaction(async (trx) => {
      const processingErrors: Array<{
        invoice: any;
        error: string;
        errorType?: string;
      }> = [];
      let successCount = 0;
      let errorCount = 0;
      for (const invoice of invoices) {
        try {
          const { invoicePayload, ticketsFormat, client_name } =
            await airTicketPayloadFormatter(invoice, '');

          const invoice_no = await this.superVoucher(req, 'AIT');

          const invoiceModel = this.Model.agentDashboardModel(trx);
          const invoiceId = await invoiceModel.insertInvoicesInfo({
            ...invoicePayload,
            invoice_org_agency: 154,
            invoice_created_by: 1666,
            invoice_no,
          });

          const clientNameGet = await invoiceModel.getClientName(
            Number(invoicePayload.invoice_client_id)
          );

          for (const ticket of ticketsFormat) {
            const {
              airTicketDetails,
              flightDetails,
              passportDetails,
              clTransPayload,
              VTransPayload,
              taxes_commission,
              vendor_name,
            } = ticket;

            console.log('GameOver', ticket);

            const { airticket_id, airticket_is_deleted, ...restAirTicket } =
              airTicketDetails;

            const vendorNameGet = await invoiceModel.getVendorName(
              Number(ticket.airTicketDetails.airticket_vendor_id)
            );

            const ac_sale_vou1 = await invoiceModel.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
              voucher_no: `Sales-${invoiceId}`,
              amount: restAirTicket.airticket_client_price,
              trans_type: 'DEBIT',
              description: `Ticket sale to ${clientNameGet.client_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_sale_vou2 = await invoiceModel.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id: this.accHead['Air Ticket(Sales)'],
              voucher_no: `Sales-${invoiceId}`,
              amount: restAirTicket.airticket_client_price,
              trans_type: 'CREDIT',
              description: `Ticket sale to ${clientNameGet.client_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_pur_vou1 = await invoiceModel.insertAccVoucherDb({
              serial_no: 1,
              acc_head_id: this.accHead['Air Ticket(Purchase)'],
              voucher_no: `Purchase-${invoiceId}`,
              amount: restAirTicket.airticket_purchase_price,
              trans_type: 'DEBIT',
              description: `Purchase ticket from ${vendorNameGet.vendor_name} on account`,
              payment_type: 'INVOICE',
            });

            const ac_pur_vou2 = await invoiceModel.insertAccVoucherDb({
              serial_no: 2,
              acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
              voucher_no: `Purchase-${invoiceId}`,
              amount: restAirTicket.airticket_purchase_price,
              trans_type: 'CREDIT',
              description: `Purchase ticket from ${vendorNameGet.vendor_name} on account`,
              payment_type: 'INVOICE',
            });

            const clTrans = await invoiceModel.insertClientTrans({
              ...clTransPayload,
              ctrxn_voucher: invoice_no,
              // ctrxn_voucher: `ClientTrans-${invoiceId}`,
              ctrxn_created_date: invoicePayload.invoice_sales_date,
              ctrxn_ref_id: invoiceId,
            });

            const vTrans = await invoiceModel.insertVendorTrans({
              ...VTransPayload,
              vtrxn_voucher: invoice_no,
              vtrxn_created_date: invoicePayload.invoice_sales_date,
              // vtrxn_voucher: `VendorTrans-${invoiceId}`,
              vtrxn_ref_id: invoiceId,
            });

            const airTicketItemPayload = {
              ...restAirTicket,
              airticket_cl_com_trans_id: clTrans.clComTransId,
              airticket_is_reissued: 1,
              airticket_cl_trans_id: clTrans.clTransId,
              airticket_invoice_id: invoiceId,
              airticket_org_agency: 154,
              airticket_v_com_trans_id: vTrans.vendorComTransId,
              airticket_v_trans_id: vTrans.vendorTransId,
              airticket_ac_sale_vou1: ac_sale_vou1,
              airticket_ac_sale_vou2: ac_sale_vou2,
              airticket_ac_pur_vou1: ac_pur_vou1,
              airticket_ac_pur_vou2: ac_pur_vou2,
            };

            const airTicketId = await invoiceModel.insertAirTicketItem(
              airTicketItemPayload
            );

            if (passportDetails) {
              console.log('NewGameStarts', passportDetails);
              await invoiceModel.insertAirTicketPax({
                p_passport_id: passportDetails?.p_passport_id,
                p_passport_no: passportDetails?.p_passport_no,
                p_passport_name: passportDetails?.p_passport_name,
                p_email: passportDetails?.p_email,
                p_mobile_no: passportDetails?.p_mobile_no,
                p_airticket_id: airTicketId,
                p_invoice_id: invoiceId,
              });
            }

            if (flightDetails) {
              const flightsDetails: IFlightDetailsDb[] = flightDetails?.map(
                (item: any) => {
                  return {
                    fltdetails_from_airport_id: item.from_airport_id
                      ? item.from_airport_id
                      : null,
                    fltdetails_to_airport_id: item.to_airport_id
                      ? item.to_airport_id
                      : null,
                    fltdetails_airline_id: item.airline_id
                      ? item.airline_id
                      : null,
                    fltdetails_flight_no: item.fltdetails_flight_no || null,
                    fltdetails_fly_date: item.fltdetails_fly_date || null,
                    fltdetails_arrival_time:
                      item.fltdetails_arrival_time || null,
                    fltdetails_departure_time:
                      item.fltdetails_departure_time || null,
                    fltdetails_airticket_id: airTicketId,
                    fltdetails_invoice_id: invoiceId,
                  };
                }
              );

              if (flightsDetails && flightsDetails.length > 0) {
                await invoiceModel.insertAirTicketFlights(flightsDetails);
              }
            }

            if (taxes_commission) {
              const taxesCommission = taxes_commission?.map((item: any) => {
                return {
                  airline_commission: item.airline_commission || 0,
                  airline_taxes: item.airline_taxes || 0,
                  airline_tax_type: item.airline_tax_type || 0,
                  airline_airticket_id: airTicketId,
                  airline_invoice_id: invoiceId,
                };
              });
              if (taxes_commission && taxes_commission.length > 0) {
                await invoiceModel.insertAirTicketCommission(taxesCommission);
              }
            }
          }
          // await this.updateVoucher(req, 'AIT');

          //content and history data must be added there
        } catch (error) {
          errorCount++;
          console.error('Error processing invoice:', error);

          // Extract error type from the error message or object
          let errorType = 'Unknown';
          if (error instanceof Error) {
            if (error.message.includes('trabill_invoices')) {
              errorType = 'Database Insert Error';
            } else if (error.message.includes('validation')) {
              errorType = 'Validation Error';
            }
            // Add more error type checks as needed
          }

          processingErrors.push({
            invoice: invoice, // or invoice.id if available
            error: error instanceof Error ? error.message : String(error),
            errorType: errorType,
          });
        }
      }
      return {
        success: errorCount === 0,
        code:
          errorCount === 0
            ? this.StatusCode.HTTP_OK
            : this.StatusCode.HTTP_PARTIAL_CONTENT,
        data: {
          totalInvoices: invoices.length,
          processedSuccessfully: successCount,
          failedToProcess: errorCount,
          invoices: invoices,
        },
        errors: processingErrors,
        errorSummary: {
          totalErrors: errorCount,
          errorTypes: processingErrors.reduce((acc, err) => {
            acc[err.errorType || 'Unknown'] =
              (acc[err.errorType || 'Unknown'] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
      };
    });
  }

  public async voidsMigration(req: Request) {
    const model = this.Model.agentDashboardModel();
    const data = await model.getAllVoidsTickets();

    const voids: any[] = [];

    const getSafeAmount = (value: any): number => {
      const num = Number(value);
      return isNaN(num) || value === null || value === undefined ? 0 : num;
    };

    for (const reVoid of data) {
      const rawServiceCharge = await model.airticketIdWiseInvoice(
        reVoid.airticket_id
      );
      const serviceCharge = rawServiceCharge ?? {};

      const getClinetInfo = await model.getSingleClientInfo(
        reVoid.airticket_client_id
      );
      const getVendorInfo = await model.getSingleEntryVendorInfo(
        reVoid.airticket_vendor_id
      );

      const shapedVoid = {
        airticket_id: reVoid.airticket_id,
        airticketNo: reVoid.airticket_ticket_no,
        void_date: formatDate(reVoid.sales_date),

        service_charge: getSafeAmount(serviceCharge.invoice_void_charge),
        airticket_client_price: getSafeAmount(
          serviceCharge.airticket_client_price
        ),
        airticket_purchase_price: getSafeAmount(
          serviceCharge.airticket_purchase_price
        ),

        client_return_amount:
          getSafeAmount(reVoid.airticket_client_price) -
          getSafeAmount(serviceCharge.invoice_void_charge),
        vendor_return_amount: getSafeAmount(reVoid.airticket_purchase_price),

        client_name: reVoid.client_name,
        client_id: getClinetInfo?.doubleClientId,
        vendor_name: reVoid.vendor_name,
        vendor_id: getVendorInfo?.vendor_id,
      };

      voids.push(shapedVoid);
    }

    // console.log('voids', voids);

    return await this.db.transaction(async (trx) => {
      const model = this.Model.agentDashboardModel(trx);
      const invoiceModel = this.Model.agentDashboardModel(trx);
      const processingErrors: Array<{
        invoice: any;
        error: string;
        errorType?: string;
      }> = [];
      let successCount = 0;
      let errorCount = 0;
      for (const migVoids of voids) {
        try {
          const ticketThings = await model.getDoubleEntryAirTicketPremium(
            migVoids.airticketNo
          );

          const strangerTicket = await model.getDoubleEntryAirTicketBussiness(
            migVoids.airticketNo
          );

          // Skip if ticketThings is not found or doesn't have airticket_id
          if (!ticketThings || !ticketThings.airticket_id) {
            console.warn(
              `Skipping void: airticket not found for ticket no ${migVoids.airticketNo}`
            );
            continue;
          }

          const payload = {
            airticket_id: ticketThings.airticket_id,
            void_date: migVoids.void_date,
            service_charge: migVoids.service_charge,
            client_return_amount: migVoids.client_return_amount,
            vendor_return_amount: migVoids.vendor_return_amount,
          };

          const voucher_no = await this.generateVoucher(req, 'AIV');
          const voucher_charge = await this.generateVoucher(req, 'TSQ');

          const getSafeAmount = (value: any): number => {
            const num = Number(value);
            return isNaN(num) || num === null || value === undefined ? 0 : num;
          };

          // --------- SALES RETURN
          const ac_vou1 = await invoiceModel.insertAccVoucherDb({
            serial_no: 1,
            acc_head_id: this.accHead['Air Ticket((-) Sales Return)'],
            voucher_no,
            amount: ticketThings.airticket_client_price,
            trans_type: 'DEBIT',
            description: `Air Ticket Sale Return From ${migVoids.client_name}`,
            payment_type: 'AIR_TICKET_VOID',
          });

          const ac_vou2 = await invoiceModel.insertAccVoucherDb({
            serial_no: 2,
            acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
            voucher_no,
            amount: ticketThings.airticket_client_price,
            trans_type: 'CREDIT',
            description: `Air Ticket Sale Return From ${migVoids.client_name}`,
            payment_type: 'AIR_TICKET_VOID',
          });

          // --------- PURCHASE RETURN
          const ac_pur_vou1 = await invoiceModel.insertAccVoucherDb({
            serial_no: 1,
            acc_head_id: this.accHead['Air Ticket(Accounts Payable)'],
            voucher_no,
            amount: ticketThings.airticket_purchase_price,
            trans_type: 'DEBIT',
            description: `Purchase Return Air Ticket to ${migVoids.client_name}`,
            payment_type: 'AIR_TICKET_VOID',
          });

          const ac_pur_vou2 = await invoiceModel.insertAccVoucherDb({
            serial_no: 2,
            acc_head_id: this.accHead['Air Ticket(Purchases Return)'],
            voucher_no,
            amount: ticketThings.airticket_purchase_price,
            trans_type: 'CREDIT',
            description: `Purchase Return Air Ticket to ${migVoids.vendor_name}`,
            payment_type: 'AIR_TICKET_VOID',
          });

          // --------- VOID SERVICE CHARGE
          const service_vou_1 = await invoiceModel.insertAccVoucherDb({
            serial_no: 1,
            acc_head_id: this.accHead['Air Ticket(Accounts Receivables)'],
            voucher_no,
            amount: getSafeAmount(migVoids.service_charge),
            trans_type: 'DEBIT',
            description: `Air Ticket Void Charge From ${migVoids.vendor_name}`,
            payment_type: 'AIR_TICKET_VOID',
          });

          const service_vou_2 = await invoiceModel.insertAccVoucherDb({
            serial_no: 2,
            acc_head_id: this.accHead['Void Charge'],
            voucher_no,
            amount: getSafeAmount(migVoids.service_charge),
            trans_type: 'CREDIT',
            description: `Air Ticket Void Charge From ${migVoids.vendor_name}`,
            payment_type: 'AIR_TICKET_VOID',
          });

          // --------- CLIENT TRANSACTIONS
          // const client_charge_trans_id = await invoiceModel.insertClientTrans({
          //   client_id: migVoids.client_id,
          //   combined_id: null,
          //   ctrxn_amount: getSafeAmount(migVoids.service_charge),
          //   ctrxn_created_at: migVoids.void_date,
          //   ctrxn_note: '',
          //   ctrxn_particular_id: 36,
          //   ctrxn_type: 'DEBIT',
          // });

          const clTrans = await invoiceModel.insertClientTrans({
            ctrxn_amount:
              strangerTicket.airticket_client_price - migVoids.service_charge,
            ctrxn_voucher: voucher_no,
            client_id: migVoids.client_id,
            ctrxn_created_at: migVoids.void_date,
            ctrxn_note: '',
            ctrxn_particular_id: 16,
            ctrxn_type: 'CREDIT',
            ctrxn_airticket_no: strangerTicket?.airticket_ticket_no,
            ctrxn_journey_date: strangerTicket?.airticket_journey_date,
            ctrxn_pax: strangerTicket?.airticket_pax_name,
            ctrxn_pnr: strangerTicket?.airticket_pnr,
            ctrxn_return_date: strangerTicket?.airticket_return_date,
            ctrxn_route: strangerTicket?.airticket_route_or_sector,
          });

          const vTrans = await invoiceModel.insertVendorTrans({
            com_vendor: strangerTicket.comb_vendor,
            vtrxn_amount: strangerTicket.airticket_purchase_price,
            vtrxn_created_at: migVoids.void_date,
            vtrxn_note: '',
            vtrxn_particular_id: 16,
            vtrxn_type: 'CREDIT',
            vtrxn_pnr: strangerTicket?.airticket_pnr,
            vtrxn_route: strangerTicket?.airticket_route_or_sector,
            vtrxn_pax: strangerTicket?.airticket_pax_name,
            vtrxn_airticket_no: strangerTicket?.airticket_ticket_no,
          });

          // const clTransServiceId = migVoids.client_id
          //   ? client_charge_trans_id?.clTransId
          //   : client_charge_trans_id?.clComTransId;

          const vTransId = migVoids.vendor_id
            ? vTrans.vendorTransId
            : vTrans.vendorComTransId;

          await model.airTicketVoid({
            client_voucher1: ac_vou1,
            client_voucher2: ac_vou2,
            vendor_voucher1: ac_pur_vou1,
            vendor_voucher2: ac_pur_vou2,
            service_vou_1: service_vou_1,
            service_vou_2: service_vou_2,
            vendor_trans_id: vTransId,
            client_trans_id: clTrans.clTransId,
            // client_charge_trans_id: clTransServiceId,
            invoice_id: migVoids.invoice_id,
            voucher_no: voucher_no,
            void_created_by: 1666,
            org_id: 154,
            ...payload,
          });

          await this.updateVoucher(req, 'AIV');

          // await model.updateAirTicketItemStatus(ticketThings.airticket_id);
        } catch (error) {
          errorCount++;
          console.error('Error processing invoice:', error);

          let errorType = 'Unknown';
          if (error instanceof Error) {
            if (error.message.includes('trabill_invoices')) {
              errorType = 'Database Insert Error';
            } else if (error.message.includes('validation')) {
              errorType = 'Validation Error';
            }
          }

          processingErrors.push({
            invoice: migVoids,
            error: error instanceof Error ? error.message : String(error),
            errorType: errorType,
          });

          console.warn('Skipped void due to error:', migVoids.airticketNo);
        }
      }

      return {
        success: errorCount === 0,
        code:
          errorCount === 0
            ? this.StatusCode.HTTP_OK
            : this.StatusCode.HTTP_PARTIAL_CONTENT,
        data: {
          totalInvoices: voids.length,
          processedSuccessfully: successCount,
          failedToProcess: errorCount,
          migration: voids,
        },
        errors: processingErrors,
        errorSummary: {
          totalErrors: errorCount,
          errorTypes: processingErrors.reduce((acc, err) => {
            acc[err.errorType || 'Unknown'] =
              (acc[err.errorType || 'Unknown'] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
        },
      };
    });
  }

  public async refreshDatabase(req: Request) {
    const model = this.Model.agentDashboardModel();

    await model.resetDatabase();

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: '',
    };
  }

  public async refreshRecDatabase(req: Request) {
    const model = this.Model.agentDashboardModel();

    await model.resetReceipt();

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: '',
    };
  }

  public async resetVoid(req: Request) {
    const model = this.Model.agentDashboardModel();

    await model.resetAirTicketVoid();

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: '',
    };
  }
  public async resetReceipt(req: Request) {
    const model = this.Model.agentDashboardModel();

    await model.resetReceipt();

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: '',
    };
  }
  public async resetRefund(req: Request) {
    const model = this.Model.agentDashboardModel();

    await model.deleteRefunds({ orgId: 154, refundId: 11143 });

    return {
      success: true,
      code: this.StatusCode.HTTP_OK,
      data: '',
    };
  }
}
export default CommonService;
