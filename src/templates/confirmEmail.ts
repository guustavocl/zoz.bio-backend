const confirmEmailTemplate = (confirmUrl: string) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="x-ua-compatible" content="ie=edge" />
        <title>Email Confirmation</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style type="text/css">
          /**
       * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
       */
          @media screen {
            @font-face {
              font-family: "Source Sans Pro";
              font-style: normal;
              font-weight: 400;
              src: local("Source Sans Pro Regular"), local("SourceSansPro-Regular"),
                url(http://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff)
                  format("woff");
            }
            @font-face {
              font-family: "Source Sans Pro";
              font-style: normal;
              font-weight: 700;
              src: local("Source Sans Pro Bold"), local("SourceSansPro-Bold"),
                url(http://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff)
                  format("woff");
            }
          }
          /**
       * Avoid browser level font resizing.
       * 1. Windows Mobile
       * 2. iOS / OSX
       */
          body,
          table,
          td,
          a {
            -ms-text-size-adjust: 100%; /* 1 */
            -webkit-text-size-adjust: 100%; /* 2 */
          }
          /**
       * Remove extra space added to tables and cells in Outlook.
       */
          table,
          td {
            mso-table-rspace: 0pt;
            mso-table-lspace: 0pt;
          }
          /**
       * Better fluid images in Internet Explorer.
       */
          img {
            -ms-interpolation-mode: bicubic;
          }
          /**
       * Remove blue links for iOS devices.
       */
          a[x-apple-data-detectors] {
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            color: inherit !important;
            text-decoration: none !important;
          }
          /**
       * Fix centering issues in Android 4.4.
       */
          div[style*="margin: 16px 0;"] {
            margin: 0 !important;
          }
          body {
            width: 100% !important;
            height: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          /**
       * Collapse table borders to avoid space between cells.
       */
          table {
            border-collapse: collapse !important;
          }
          a {
            color: #1a82e2;
          }
          img {
            height: auto;
            line-height: 100%;
            text-decoration: none;
            border: 0;
            outline: none;
          }
        </style>
      </head>
      <body style="background-color: #010101">
        <div
          class="preheader"
          style="
            display: none;
            max-width: 0;
            max-height: 0;
            overflow: hidden;
            font-size: 1px;
            line-height: 1px;
            color: #fff;
            opacity: 0;
          "
        >
          Confirm your account to put together all your links in one place!
        </div>

        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td align="center" bgcolor="#010101">
              <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="max-width: 600px"
              >
                <tr>
                  <td align="center" valign="top" style="padding: 36px 24px">
                    <a
                      href="http://zoz.bio"
                      target="_blank"
                      style="display: inline-block"
                    >
                      <img
                        src="https://zoz.bio/zoz.png?v=2"
                        alt="Zoz.bio Logo"
                        border="0"
                        width="300"
                        style="
                          display: block;
                          width: 300px;
                          max-width: 300px;
                          min-width: 300px;
                        "
                      />
                    </a>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#010101">
              <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="max-width: 600px"
              >
                <tr>
                  <td
                    align="left"
                    bgcolor="#ffffff"
                    style="
                      padding: 36px 24px 0;
                      font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                      border-top: 3px solid #d4dadf;
                    "
                  >
                    <h1
                      style="
                        margin: 0;
                        font-size: 32px;
                        font-weight: 700;
                        letter-spacing: -1px;
                        line-height: 48px;
                      "
                    >
                      Confirm Your Email Address
                    </h1>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
            </td>
          </tr>
          <tr>
            <td align="center" bgcolor="#010101">
              <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="max-width: 600px"
              >
                <tr>
                  <td
                    align="left"
                    bgcolor="#ffffff"
                    style="
                      padding: 24px;
                      font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                      font-size: 16px;
                      line-height: 24px;
                    "
                  >
                    <p style="margin: 0">
                      Tap the button below to confirm your email address. If you
                      didn't create an account with
                      <a target="_blank" href="http://zoz.bio">zoz.bio</a>, you can
                      safely delete this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td align="left" bgcolor="#ffffff">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td align="center" bgcolor="#ffffff" style="padding: 12px">
                          <table border="0" cellpadding="0" cellspacing="0">
                            <tr>
                              <td
                                align="center"
                                bgcolor="#1a82e2"
                                style="border-radius: 6px"
                              >
                                <a
                                  href="${confirmUrl}"
                                  target="_blank"
                                  style="
                                    display: inline-block;
                                    padding: 16px 36px;
                                    font-family: 'Source Sans Pro', Helvetica, Arial,
                                      sans-serif;
                                    font-size: 16px;
                                    color: #ffffff;
                                    text-decoration: none;
                                    border-radius: 6px;
                                  "
                                  >CONFIRM YOUR ACCOUNT</a
                                >
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td
                    align="left"
                    bgcolor="#ffffff"
                    style="
                      padding: 24px;
                      font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                      font-size: 16px;
                      line-height: 24px;
                    "
                  >
                    <p style="margin: 0">
                      If that doesn't work, copy and paste the following link in
                      your browser:
                    </p>
                    <p style="margin: 0; word-break: break-all;">
                      <a
                        target="_blank"
                        href="${confirmUrl}"
                        target="_blank"
                        >${confirmUrl}</a
                      >
                    </p>
                  </td>
                </tr>
                <tr>
                  <td
                    align="left"
                    bgcolor="#ffffff"
                    style="
                      padding: 24px;
                      font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                      font-size: 16px;
                      line-height: 24px;
                      border-bottom: 3px solid #d4dadf;
                    "
                  >
                    <p style="margin: 0">
                      Cheers, 
                      <a target="_blank" href="http://zoz.bio/gustavo"
                        >@Gustavo</a
                      >
                    </p>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
            </td>
          </tr>

          <tr>
            <td align="center" bgcolor="#010101" style="padding: 24px">
              <!--[if (gte mso 9)|(IE)]>
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
            <tr>
            <td align="center" valign="top" width="600">
            <![endif]-->
              <table
                border="0"
                cellpadding="0"
                cellspacing="0"
                width="100%"
                style="max-width: 600px"
              >
                <tr>
                  <td
                    align="center"
                    bgcolor="#e9ecef"
                    style="
                      padding: 12px 24px;
                      font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                      font-size: 14px;
                      line-height: 20px;
                      color: #666;
                    "
                  >
                    <p style="margin: 0">
                      You received this email because we received a request to 
                      register an account on your email. If you didn't request 
                      that you can safely delete this email.
                    </p>
                  </td>
                </tr>
              </table>
              <!--[if (gte mso 9)|(IE)]>
            </td>
            </tr>
            </table>
            <![endif]-->
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};

export default confirmEmailTemplate;
