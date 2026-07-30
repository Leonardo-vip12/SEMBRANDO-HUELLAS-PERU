import { useTranslation } from 'react-i18next';
import CrudForm, { FormSection, FormField, FormInput, FormSelect } from '../../components/shared/CrudForm';

export default function SettingsPage() {
  const { t } = useTranslation();
  return (
    <CrudForm title={t('admin.settings')} onSave={() => {}}>
      <FormSection title={t('admin.siteInfo')}>
        <FormField label={t('admin.siteName')}>
          <FormInput defaultValue="Sembrando Huellas Perú" />
        </FormField>
        <FormField label={t('admin.siteUrl', 'URL del sitio')}>
          <FormInput defaultValue="https://sembrandohuellas.org" />
        </FormField>
        <FormField label={t('admin.mainLanguage')}>
          <FormSelect>
            <option value="es">{t('admin.spanish', 'Español')}</option>
            <option value="en">{t('admin.english', 'Inglés')}</option>
            <option value="pt">{t('admin.portuguese', 'Portugués')}</option>
          </FormSelect>
        </FormField>
        <FormField label={t('admin.theme', 'Tema')}>
          <FormSelect>
            <option value="light">{t('admin.light', 'Claro')}</option>
            <option value="dark">{t('admin.dark', 'Oscuro')}</option>
            <option value="system">{t('admin.system', 'Sistema')}</option>
          </FormSelect>
        </FormField>
      </FormSection>

      <FormSection title={t('admin.emailNotifications', 'Correo y Notificaciones')}>
        <FormField label={t('admin.contactEmail', 'Correo de contacto')}>
          <FormInput type="email" defaultValue="contacto@sembrandohuellas.org" />
        </FormField>
        <FormField label={t('admin.notificationEmail', 'Correo de notificaciones')}>
          <FormInput type="email" defaultValue="notificaciones@sembrandohuellas.org" />
        </FormField>
        <FormField label={t('admin.smtpHost', 'SMTP Host')}>
          <FormInput />
        </FormField>
        <FormField label={t('admin.smtpPort', 'SMTP Puerto')}>
          <FormInput type="number" />
        </FormField>
      </FormSection>

      <FormSection title={t('admin.analyticsSeo', 'Analytics y SEO')}>
        <FormField label={t('admin.googleAnalyticsId', 'Google Analytics ID')}>
          <FormInput placeholder="G-XXXXXXXXXX" />
        </FormField>
        <FormField label={t('admin.googleTagManager', 'Google Tag Manager')}>
          <FormInput placeholder="GTM-XXXXXXX" />
        </FormField>
        <FormField label={t('admin.metaPixelId', 'Meta Pixel ID')}>
          <FormInput placeholder="1234567890" />
        </FormField>
        <FormField label={t('admin.siteVerification', 'Verificación de sitio')}>
          <FormInput placeholder="google-site-verification" />
        </FormField>
      </FormSection>
    </CrudForm>
  );
}
