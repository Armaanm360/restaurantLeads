import { projectLogo, projectName, projectURL } from './templateConstants';

export const sendEmailVerificationTemplate = (
  name: string,
  email: string,
  password: string
) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${projectName} Account Verification</title>
    </head>
    <body
      style="
        font-family: Helvetica, Arial, sans-serif;
        margin: 0px;
        padding: 0px;
        background-color: #ffffff;
      "
    >
      <table
        role="presentation"
        style="
          width: 100%;
          border-collapse: collapse;
          border: 0px;
          border-spacing: 0px;
          font-family: Arial, Helvetica, sans-serif;
          background-color: rgb(239, 239, 239);
        "
      >
        <tbody>
          <tr>
            <td
              align="center"
              style="padding: 1rem 2rem; vertical-align: top; width: 100%"
            >
              <table
                role="presentation"
                style="
                  max-width: 600px;
                  border-collapse: collapse;
                  border: 0px;
                  border-spacing: 0px;
                  text-align: left;
                "
              >
                <tbody>
                  <tr>
                    <td style="padding: 40px 0px 0px">
                      <div style="text-align: left">
                        <div style="padding-bottom: 20px">
                          <img
                            src="${projectLogo}"
                            alt="${projectName}"
                            style="width: 100px"
                          />
                        </div>
                      </div>
                      <div
                        style="
                          padding: 20px;
                          background-color: rgb(255, 255, 255);
                        "
                      >
                        <div style="color: rgb(0, 0, 0); text-align: left">
                          <h1 style="margin: 1rem 0">Account Verification</h1>
                          <p style="padding-bottom: 16px">
                            Dear ${name},
                          </p>
                          <p style="padding-bottom: 16px">
                            Thank you for creating an account with ${projectName}. Your login credentials are as follows:
                          </p>
                          <p style="padding-bottom: 16px">
                            <strong>Email:</strong> ${email}
                          </p>
                          <p style="padding-bottom: 16px">
                            <strong>Password:</strong> ${password}
                          </p>
                          <p style="padding-bottom: 16px">
                            To access your account, click on the following link:
                          </p>
                          <p style="padding-bottom: 16px">
                            <a href="http://mtltd.com.bd/auth/login" style="text-decoration: none; color: #007BFF;">Login to Your Account</a>
                          </p>
                          <p style="padding-bottom: 16px">
                            If you did not create an account or have any concerns, please contact us immediately.
                          </p>
                          <p style="padding-bottom: 16px">
                            Best regards,<br />
                            <b>${projectName}</b>
                          </p>
                        </div>
                      </div>
                      <div
                        style="
                          padding-top: 20px;
                          color: rgb(153, 153, 153);
                          text-align: center;
                        "
                      >
                        <p>Web Link: ${projectURL}</p>
                        <p>Powered by <a href="http://m360ict.com" style="text-decoration: none; color: #007BFF;">m360ict.com</a></p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
  </html>
  `;
};
