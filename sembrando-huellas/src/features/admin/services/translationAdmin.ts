import { ApiService } from '@/services/api';

export class TranslationAdminService {
  static async getLanguages(activeOnly?: boolean) {
    const params = activeOnly ? '?activeOnly=true' : '';
    const res = await ApiService.get(`/i18n/languages${params}`);
    return res.data;
  }

  static async createLanguage(data: { code: string; name: string; nativeName?: string }) {
    const res = await ApiService.post('/i18n/languages', data);
    return res.data;
  }

  static async updateLanguage(id: string, data: any) {
    const res = await ApiService.patch(`/i18n/languages/${id}`, data);
    return res.data;
  }

  static async deleteLanguage(id: string) {
    const res = await ApiService.delete(`/i18n/languages/${id}`);
    return res.data;
  }

  static async setDefaultLanguage(id: string) {
    const res = await ApiService.post(`/i18n/languages/${id}/default`, {});
    return res.data;
  }

  static async getTranslationKeys(params?: { namespace?: string; languageId?: string; group?: string; search?: string; page?: number; limit?: number }) {
    const search = new URLSearchParams();
    if (params?.namespace) search.set('namespace', params.namespace);
    if (params?.languageId) search.set('languageId', params.languageId);
    if (params?.group) search.set('group', params.group);
    if (params?.search) search.set('search', params.search);
    if (params?.page) search.set('page', String(params.page));
    if (params?.limit) search.set('limit', String(params.limit));
    const res = await ApiService.get(`/i18n/keys?${search}`);
    return res.data;
  }

  static async upsertKey(data: { key: string; namespace?: string; value: string; languageId: string; group?: string; tags?: string[] }) {
    const res = await ApiService.post('/i18n/keys', data);
    return res.data;
  }

  static async deleteKey(id: string) {
    const res = await ApiService.delete(`/i18n/keys/${id}`);
    return res.data;
  }

  static async getMissingKeys(languageId: string) {
    const res = await ApiService.get(`/i18n/missing/${languageId}`);
    return res.data;
  }

  static async importTranslations(formData: FormData) {
    const res = await ApiService.post('/i18n/import', formData);
    return res.data;
  }

  static async exportTranslations(languageId: string, format?: string) {
    const params = format ? `?format=${format}` : '';
    const res = await ApiService.get(`/i18n/export/${languageId}${params}`);
    return res.data;
  }

  static async getTranslationStats() {
    const res = await ApiService.get('/i18n/stats');
    return res.data;
  }

  static async autoTranslate(languageId: string) {
    const res = await ApiService.post('/i18n/translate-all', { languageId });
    return res.data;
  }

  static async getContentTranslations(entityType: string, entityId: string) {
    const res = await ApiService.get(`/i18n/translations/${entityType}/${entityId}`);
    return res.data;
  }

  static async upsertTranslation(data: { entityType: string; entityId: string; field: string; value: string; languageId: string }) {
    const res = await ApiService.put('/i18n/translations', data);
    return res.data;
  }
}
