import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
     "112473784586414666365",
     "cec5af7eea750bbf30eb644ec75e04d039861f1b",
     "https://accounts.google.com/o/oauth2/auth"
);

export function getAuthUrl() {
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/drive.readonly'
        ]
      });
}

export async function getAccessToken(code) {
  try {
    const { tokens } = await oauth2Client.getToken(code);
    const accessToken = tokens.access_token;
    return accessToken;
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
}
