import { CONFIG } from './config.js';
import { authService } from './auth.js';

export interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Kvasar API Client
 * Handles authenticated requests to Kvasar backend services
 */
export class KvasarClient {
  private baseUrl: string;
  private accessToken?: string; // Optional override

  constructor(accessToken?: string) {
    this.baseUrl = CONFIG.api.baseUrl;
    this.accessToken = accessToken;
  }

  /**
   * Resolve access token to use for request
   */
  private async resolveToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken;
    }
    return await authService.getAccessToken();
  }

  /**
   * Make an authenticated request to the Kvasar API
   */
  private async request(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<any> {
    const accessToken = await this.resolveToken();

    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const response = await fetch(url, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        ...options.headers,
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText}${errorBody ? `: ${errorBody}` : ''}`);
    }

    // Handle no content
    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  // Generic HTTP methods
  get(endpoint: string, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  patch(endpoint: string, body?: any, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  delete(endpoint: string, options?: RequestOptions) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }

  // ========== Value Streams ==========
  async listValueStreams(): Promise<any> {
    return this.get('/api/v1/vas/');
  }

  async getValueStream(id: string): Promise<any> {
    return this.get(`/api/v1/vas/${id}`);
  }

  async createValueStream(body: any): Promise<any> {
    return this.post('/api/v1/vas/', body);
  }

  async updateValueStream(id: string, body: any): Promise<any> {
    return this.put(`/api/v1/vas/${id}`, body);
  }

  async deleteValueStream(id: string): Promise<any> {
    return this.delete(`/api/v1/vas/${id}`);
  }

  async patchValueStream(id: string, body: any): Promise<any> {
    return this.patch(`/api/v1/vas/${id}`, body, {
      headers: { 'Content-Type': 'application/json-patch+json' }
    });
  }

  async updateStages(id: string, stages: any[]): Promise<any> {
    return this.put(`/api/v1/vas/${id}/stages`, stages);
  }

  async addStage(id: string, stage: any): Promise<any> {
    return this.post(`/api/v1/vas/${id}/stages`, stage);
  }

  async addSolutions(id: string, solutionIds: any[]): Promise<any> {
    return this.post(`/api/v1/vas/${id}/solutions`, solutionIds);
  }

  async addArt(id: string, art: any): Promise<any> {
    return this.post(`/api/v1/vas/${id}/arts`, art);
  }

  async copyValueStream(id: string, body: any): Promise<any> {
    return this.post(`/api/v1/vas/${id}/copy`, body);
  }

  // ========== Users ==========
  async listUsers(): Promise<any> {
    return this.get('/api/v1/users/');
  }

  async createUser(body: any): Promise<any> {
    return this.post('/api/v1/users/', body);
  }

  async updateUser(body: any): Promise<any> {
    return this.put('/api/v1/users/', body);
  }

  // ========== Teams ==========
  async listTeams(): Promise<any> {
    return this.get('/api/v1/teams/');
  }

  async createTeam(body: any): Promise<any> {
    return this.post('/api/v1/teams/', body);
  }

  async updateTeam(body: any): Promise<any> {
    return this.put('/api/v1/teams/', body);
  }

  // ========== Strategic Themes ==========
  async listStrategicThemes(): Promise<any> {
    return this.get('/api/v1/strategicthemes/');
  }

  async getStrategicTheme(id: string): Promise<any> {
    return this.get(`/api/v1/strategicthemes/${id}`);
  }

  async createStrategicTheme(body: any): Promise<any> {
    return this.post('/api/v1/strategicthemes/', body);
  }

  async updateStrategicTheme(id: string, body: any): Promise<any> {
    return this.put(`/api/v1/strategicthemes/${id}`, body);
  }

  async deleteStrategicTheme(id: string): Promise<any> {
    return this.delete(`/api/v1/strategicthemes/${id}`);
  }

  async patchStrategicTheme(id: string, body: any): Promise<any> {
    return this.patch(`/api/v1/strategicthemes/${id}`, body);
  }

  async addKeyResult(strategicThemeId: string, keyResult: any): Promise<any> {
    return this.put(`/api/v1/strategicthemes/${strategicThemeId}/keyresults`, keyResult);
  }

  async addBudgetDistribution(strategicThemeId: string, budget: any): Promise<any> {
    return this.put(`/api/v1/strategicthemes/${strategicThemeId}/budgetdistribution`, budget);
  }

  // ========== Solutions ==========
  async listSolutions(): Promise<any> {
    return this.get('/api/v1/solutions/');
  }

  async getSolution(id: string): Promise<any> {
    return this.get(`/api/v1/solutions/${id}`);
  }

  async createSolution(body: any): Promise<any> {
    return this.post('/api/v1/solutions/', body);
  }

  async updateSolution(id: string, body: any): Promise<any> {
    return this.put(`/api/v1/solutions/${id}`, body);
  }

  async deleteSolution(id: string): Promise<any> {
    return this.delete(`/api/v1/solutions/${id}`);
  }

  async patchSolution(id: string, body: any): Promise<any> {
    return this.patch(`/api/v1/solutions/${id}`, body);
  }

  async addRelation(solutionId: string, relation: any): Promise<any> {
    return this.put(`/api/v1/solutions/${solutionId}/relations`, relation);
  }

  // ========== Roadmaps ==========
  async listRoadmaps(): Promise<any> {
    return this.get('/api/v1/roadmaps/');
  }

  async createRoadMap(body: any): Promise<any> {
    return this.post('/api/v1/roadmaps/', body);
  }

  async updateRoadMap(body: any): Promise<any> {
    return this.put('/api/v1/roadmaps/', body);
  }

  // ========== Portfolios ==========
  async listPortfolios(): Promise<any> {
    return this.get('/api/v1/portfolios/');
  }

  async createPortfolio(body: any): Promise<any> {
    return this.post('/api/v1/portfolios/', body);
  }

  async updatePortfolio(body: any): Promise<any> {
    return this.put('/api/v1/portfolios/', body);
  }

  // ========== Program Increments ==========
  async getProgramIncrement(id: string): Promise<any> {
    return this.get(`/api/v1/pis/${id}`);
  }

  async updateProgramIncrement(id: string, body: any): Promise<any> {
    return this.put(`/api/v1/pis/${id}`, body);
  }

  async deleteProgramIncrement(id: string): Promise<any> {
    return this.delete(`/api/v1/pis/${id}`);
  }

  async addSprint(piId: string, sprint: any): Promise<any> {
    return this.put(`/api/v1/pis/${piId}/sprints`, sprint);
  }

  // ========== Organizations ==========
  async getOrganization(id: string): Promise<any> {
    return this.get(`/api/v1/organizations/${id}`);
  }

  async updateOrganization(id: string, body: any): Promise<any> {
    return this.put(`/api/v1/organizations/${id}`, body);
  }

  async deleteOrganization(id: string): Promise<any> {
    return this.delete(`/api/v1/organizations/${id}`);
  }

  async patchOrganization(id: string, body: any): Promise<any> {
    return this.patch(`/api/v1/organizations/${id}`, body);
  }

  // ========== Items ==========
  async getItem(id: string): Promise<any> {
    return this.get(`/api/v1/items/${id}`);
  }

  async updateItem(id: string, body: any): Promise<any> {
    return this.put(`/api/v1/items/${id}`, body);
  }

  async deleteItem(id: string): Promise<any> {
    return this.delete(`/api/v1/items/${id}`);
  }

  async patchItem(id: string, body: any): Promise<any> {
    return this.patch(`/api/v1/items/${id}`, body);
  }

  async addItemRelation(featureId: string, relation: any): Promise<any> {
    return this.put(`/api/v1/items/${featureId}/relations`, relation);
  }

  // ========== Groups ==========
  async listGroups(): Promise<any> {
    return this.get('/api/v1/groups/');
  }

  async createGroup(body: any): Promise<any> {
    return this.post('/api/v1/groups/', body);
  }

  async updateGroup(body: any): Promise<any> {
    return this.put('/api/v1/groups/', body);
  }

  // ========== Team Members ==========
  async listTeamMembers(): Promise<any> {
    return this.get('/api/v1/teammembers/');
  }

  async createTeamMember(body: any): Promise<any> {
    return this.post('/api/v1/teammembers/', body);
  }

  // ========== KPIs ==========
  async listKPIs(): Promise<any> {
    return this.get('/api/v1/kpis/');
  }

  async createKPI(body: any): Promise<any> {
    return this.post('/api/v1/kpis/', body);
  }

  async updateKPI(body: any): Promise<any> {
    return this.put('/api/v1/kpis/', body);
  }

  // ========== Kanbans ==========
  async listKanbans(): Promise<any> {
    return this.get('/api/v1/kanbans/');
  }

  async createKanban(body: any): Promise<any> {
    return this.post('/api/v1/kanbans/', body);
  }

  async updateKanban(body: any): Promise<any> {
    return this.put('/api/v1/kanbans/', body);
  }

  // ========== Objectives ==========
  async listObjectives(): Promise<any> {
    return this.get('/api/v1/objectives/');
  }

  async updateObjective(body: any): Promise<any> {
    return this.put('/api/v1/objectives/', body);
  }

  // ========== ARTs ==========
  async listARTs(): Promise<any> {
    return this.get('/api/v1/arts/');
  }

  async createART(body: any): Promise<any> {
    return this.post('/api/v1/arts/', body);
  }

  async updateART(body: any): Promise<any> {
    return this.put('/api/v1/arts/', body);
  }

  // ========== User Settings ==========
  async changePassword(body: any): Promise<any> {
    return this.put('/api/v1/change_password', body);
  }

  async changeName(body: any): Promise<any> {
    return this.put('/api/v1/change_name', body);
  }

  // Add more specific methods as needed for agile management features
}

export const kvasarClient = new KvasarClient();
