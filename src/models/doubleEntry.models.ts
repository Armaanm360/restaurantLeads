// import { AdAbstractModels } from '../../../abstracts/abstract.models';
// import { idType } from '../../../common/types/common.types';
// import CustomError from '../../../common/utils/errors/customError';
// import { IQuery } from '../reports/root/report.interfaces';

// class DoubleEntryModels extends AdAbstractModels {
//   // GROUPS
//   allGroups = async () => {
//     return await this.db('acc_group').select(
//       'code',
//       'name',
//       'status',
//       'description'
//     );
//   };

//   //   ACCOUNT HEAD
//   allAccHeads = async ({
//     limit,
//     order_by,
//     search,
//     skip,
//     head_id,
//   }: IQuery & { head_id: number }) => {
//     const data = await this.db('acc_head')
//       .select(
//         'head_id',
//         'head_group_code',
//         'head_code',
//         'head_name',
//         'head_status',
//         'head_description'
//       )
//       .modify((e) => {
//         if (search) {
//           e.select(
//             this.db.raw(
//               `
//           (
//             CASE
//               WHEN head_group_code LIKE ? THEN 3
//               WHEN head_code LIKE ? THEN 2
//               WHEN head_name LIKE ? THEN 1
//               ELSE 0
//             END
//           ) AS relevance_score
//         `,
//               [`%${search}%`, `%${search}%`, `%${search}%`]
//             )
//           )
//             .orWhereRaw('head_group_code like ?', [`%${search}%`])
//             .orWhereRaw('head_code like ?', [`%${search}%`])
//             .orWhereRaw('head_name like ?', [`%${search}%`])
//             .orderBy('relevance_score', 'desc');
//         } else {
//           e.orderBy('head_name', order_by || 'asc');
//         }
//         if (head_id) {
//           e.where('head_id', head_id);
//         }
//       })
//       .limit(+limit || 20)
//       .offset(+skip || 0);
//     const { count } = await this.db('acc_head')
//       .count('head_id as count')
//       .modify((e) => {
//         if (search) {
//           e.orWhereRaw('head_group_code like ?', [`%${search}%`])
//             .orWhereRaw('head_code like ?', [`%${search}%`])
//             .orWhereRaw('head_name like ?', [`%${search}%`]);
//         }
//         if (head_id) {
//           e.where('head_id', head_id);
//         }
//       })
//       .first();

//     return { count, data };
//   };

//   getHeadCodeByGroup = async (headGroupCode: idType) => {
//     return (await this.db('acc_head')
//       .select('head_code', 'head_id')
//       .where('head_group_code', headGroupCode)
//       .orderBy('head_id', 'desc')
//       .limit(1)
//       .first()) as { head_code: string; head_id: number };
//   };

//   getHeadCodeByHeadId = async (id: idType) => {
//     return (await this.db('acc_head')
//       .select('head_code', 'head_group_code')
//       .where('head_id', id)
//       .first()) as { head_code: string; head_group_code: string };
//   };

//   getGroupAndParent = async (id: idType) => {
//     const data = await this.db('acc_head')
//       .select('head_code')
//       .where('head_parent_id', id)
//       .orderBy('head_id', 'desc')
//       .limit(1)
//       .first();

//     return data?.head_code;
//   };

//   getLastHeadCodeByParent = async (id: idType) => {
//     const data = (await this.db('acc_head')
//       .select('head_code')
//       .where('head_parent_id', id)
//       .orderBy('head_id', 'desc')
//       .limit(1)
//       .first()) as { head_code: string };

//     return data?.head_code;
//   };

//   getLastHeadCodeByHeadCode = async (headCode: string) => {
//     return (await this.db('acc_head')
//       .select('head_code', 'head_id')
//       .whereRaw('head_code LIKE ?', [`${headCode}%`])
//       .orderBy('head_id', 'desc')
//       .limit(1)
//       .first()) as { head_code: string; head_id: number };
//   };

//   getLastGroupCode = async (groupCode: string) => {
//     return (await this.db('acc_head')
//       .select('head_code', 'head_id', 'head_group_code')
//       .where('head_group_code', groupCode)
//       .orderBy('head_id', 'desc')
//       .limit(1)
//       .first()) as {
//       head_code: string;
//       head_id: number;
//       head_head_code: any;
//     };
//   };

//   insertAccHead = async (payload: IAccHeadDb | IAccHeadDb[]) => {
//     const [id] = await this.db('acc_head').insert(payload);
//     return id;
//   };

//   updateAccHead = async (payload: any, id: idType) => {
//     return await this.db('acc_head').update(payload).where('head_id', id);
//   };

//   deleteAccHead = async (id: idType) => {
//     return await this.db('acc_head').del().where('head_id', id);
//   };

//   //   ACCOUNT VOUCHERS

//   allAccVouchers = async () => {
//     return await this.db('v_acc_vouchers').select('*');
//     // .where('org_id', this.org_agency);
//   };

//   insertAccVoucher = async (payload: IVoucher) => {
//     const [id] = await this.db('acc_voucher').insert(payload);

//     return id;
//   };

//   updateAccVoucher = async (payload: IVoucher, id: idType) => {
//     return await this.db('acc_voucher').update(payload).where('id', id);
//   };

//   getHeadByAccount = async (accountId: idType) => {
//     const data = (await this.db('trabill_accounts')
//       .first('account_head_id')
//       .where('account_id', accountId)) as { account_head_id: number };

//     if (!data?.account_head_id) {
//       throw new CustomError(
//         'Please provide valid account',
//         400,
//         'Invalid account'
//       );
//     }

//     return data?.account_head_id;
//   };

//   deleteAccVoucher = async (id: idType) => {
//     return await this.db('acc_voucher').del().where('id', id);
//   };

//   deleteAccVouchers = async (voucherNo: string) => {
//     await this.db('acc_voucher')
//       // .where('org_id', this.org_agency)
//       .andWhere('voucher_no', 'like', `${voucherNo}%`)
//       .del();
//   };

//   // get account group
//   public async getAccountGroup(code: string, status: number) {
//     return await this.db('acc_group')
//       .select('code', 'name')
//       .where((qb) => {
//         if (code) {
//           qb.andWhere({ code });
//         }
//         qb.andWhere({ status });
//       });
//   }

//   // Get account head
//   public async getAccountHead({
//     company_id,
//     code,
//     group_code,
//     parent_id,
//     // status,
//     name,
//     order_by,
//     order_to,
//     id,
//     id_greater,
//   }: any) {
//     return await this.db('acc_head AS ah')
//       .select(
//         'ah.id',
//         'ah.code',
//         'ah.group_code',
//         'ah.description',
//         'ah.parent_id',
//         'ah.name',
//         'ag.name AS group_name'
//       )
//       .join('acc_group AS ag', 'ah.group_code', 'ag.code')
//       .where((qb) => {
//         qb.andWhere('ah.company_id', company_id);
//         // qb.andWhere('ah.status', status);
//         if (id_greater) {
//           qb.andWhere('ah.id', '>', id_greater);
//         }
//         if (id) {
//           qb.andWhere('ah.id', id);
//         }
//         if (code) {
//           qb.andWhere('ah.code', code);
//         }
//         if (group_code) {
//           qb.andWhere('ah.group_code', group_code);
//         }
//         if (parent_id) {
//           qb.andWhere('ah.parent_id', parent_id);
//         } else if (parent_id === null) {
//           qb.whereNull('ah.parent_id');
//         }
//         if (name) {
//           qb.andWhereILike('ah.name', `%${name}%`);
//         }
//       })
//       .orderBy(order_by ? order_by : 'ah.code', order_to ? order_to : 'asc');
//   }

//   // Create account head
//   public async createAccountHead(body: any) {
//     return await this.db('acc_head').insert(body, 'id');
//   }
// }

// export default DoubleEntryModels;
