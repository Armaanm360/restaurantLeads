import { google } from "googleapis";
import axios from "axios";

class PushNotificationService {
  static async generateFCMAccessToken(): Promise<string> {
    const serviceAccountJson = {
      type: "service_account",
      project_id: "crm360-4eefd",
      private_key_id: "b32aa4d32e54d4c4e48072a20c79b6a5b20d018e",
      private_key:
        "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCUR0XsbZCD7wOh\nPguwXRymGPH80ymq8M5P2uHN/8kI83Kacqig53OfSjlktucH4K6YNejlNiOnEn2h\n3f6pcVwQv5EigB2WglNJtc13IMAy40FXaPqGCZjTVnU7/+LC+moNW8yKGbH63Jzx\nKFLjO4PzgunN5BrZP5lpmjXdYGVqy6SYMxzzatqOMqCtFuOh0hlAXQPdyBepU9ED\nqqCmB80ukO4p79x0Z/jBQp05R/Bbjc+dnW7LeTD4osehpmMnnLXQCT3dA+MSMJQJ\nM95IHaZ6EqE6YDuqtDH6OdOwXRfiEjZFMpi9ZgglFVdTM68t++vPOQO5iqaMtCNE\nH7PIJpoNAgMBAAECggEAAd3EDVZZ0+WuLBUKCY6ydjaX5agjicl0p9e29VND+6Ex\nDvFCowRZ85lebY9817mKTDolNfESs83114K3UefZBWZHDhmCkqBSO6TN8uY7GEJ4\n67u57AcqOmSY62oS4mIHSScXPG4COwADcfEQUgLrji2JtYtdxhOyYcCd3iSSIBNd\ncLva51Ta80Bu4UH4TsF6T/WDBxIOKpM2qkZKw2EXLD1X0oCpFHftuOU7lMK1TPby\nfZtA0E0IB2iN3RKz4yIdekmrrhgvg4Lsqw6UF5tgAY7pzBHsvqJTW57d/jtdWDuJ\nBtSkInyTC00vexjeq+7UDwbDrLad2yn8cMrPquHyIQKBgQDQiHPJaxsOAhxrfkxi\n79J0g4tjwJ2boIHN/P3x0MBOULoyk5HhOEr7fjz4RETHIjFJBhB0l2/0FmJnsk6u\nX47suZ/LK8YJTC5GcUHGHvevOtqd+1veCv5nR6sM13HBYW70VNE1Ozs2V3Z9baoE\nn9+djVGEykicjBzyMLvZ2iUgeQKBgQC2B7Cf53qPn2qlIUkYoDrw8uqPsP4SZsfn\nC9b2RmWNeY8K65B92n6BUemLQwx+d0BulcSgti8qAIF8NcMJ48x2japnkmSPPOde\n6sENvMXVxSvsOR+2r/No5A/Gpq0GuM664kTzTqKtwgulUV6pNZuyq7T1rBxPQipc\nGPCMAH+pNQKBgQCm1lTUs/VMStIUClLw4PCeuVO+9i7igRL5C8zcN+hzf9DIgBo5\nd4E+HqyG8I+aRjfqNYjazwIJ5hLK5fRfPCKsMIKw2Q+zBpkLULeP29zL/ClGNgE0\n79TEKqmmN4RSdDKCFo3eqcng2y74gNGCq6oLcjHjLLfVT6AlAGp6jDYh+QKBgQCR\nqf2xOC9flxZkJgq0ZiREhF8ntV7botv9DABs+1BwsgHBn1f1Hk91dPMKuhDZctxg\nogDDCocbeWQk3XDCDUSk6iCe2QsXhIkx73GlaJZ3xlyrn9q8+ngyS65ELUTwyBrG\neiLrANY1bb6cAE1b4sZBaB5bKetNkYkMQfjcT9nYsQKBgQCZdL87gcPR0ky8GSqo\nvw+LCsPJ3dYlhZwNlmCgk38kK4Ib6prduRqa7+0CLxk8MVvueQ6iRuMqsTpgMEk+\nw6QSkBb+ADaW6sHKRC8y1bGfCBJBVQfMkedO2aGehJB02g3TTsqiBoipDFOLdi4A\nSVkzbAXB5KA+jOK+9vLaUfBJ+g==\n-----END PRIVATE KEY-----\n",
      client_email: "crmnotification@crm360-4eefd.iam.gserviceaccount.com",
      client_id: "112728813274645313240",
      auth_uri: "https://accounts.google.com/o/oauth2/auth",
      token_uri: "https://oauth2.googleapis.com/token",
      auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
      client_x509_cert_url:
        "https://www.googleapis.com/robot/v1/metadata/x509/crmnotification%40crm360-4eefd.iam.gserviceaccount.com",
      universe_domain: "googleapis.com",
    };

    const scopes = ["https://www.googleapis.com/auth/firebase.messaging"];

    const authClient = await google.auth.getClient({
      credentials: serviceAccountJson,
      scopes: scopes,
    });

    const accessTokenResponse = await authClient.getAccessToken();
    return accessTokenResponse.token as any;
  }

  static async sendNotificationToSelectedDriver({
    accessToken,
    title,
    body,
    ref_id,
    deviceToken,
  }: {
    accessToken: string;
    title: string;
    body?: string;
    ref_id: string;
    deviceToken: string;
  }): Promise<boolean> {
    const url =
      "https://fcm.googleapis.com/v1/projects/crm360-4eefd/messages:send";

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    };

    const bodyData = {
      message: {
        token: deviceToken,
        notification: {
          title: title,
          body: body,
        },
        data: { refId: ref_id },
      },
    };

    // console.log({ bodyData });

    try {
      const response = await axios.post(url, bodyData, { headers: headers });
      console.log("sended push notification");
      return response.status === 200;
    } catch (error) {
      // console.error("Error sending notification:", error);
      return false;
    }
  }
}

export default PushNotificationService;
