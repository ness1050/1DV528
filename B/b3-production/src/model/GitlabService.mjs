import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const { GITLAB_BASE_URL, ACCESS_TOKEN, P_ID } = process.env;

const gitlabApi = axios.create({
  baseURL: `${GITLAB_BASE_URL}/api/v4/projects/${encodeURIComponent(P_ID)}`,
  headers: { 'Authorization': `Bearer ${ACCESS_TOKEN}` }
});

export const gitlabService = {
  async fetchIssues() {
    try {
      const response = await gitlabApi.get('/issues');
      return response.data;
    } catch (error) {
      console.error('Error fetching GitLab issues:', error);
      throw error;
    }
  }
};
