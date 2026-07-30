import CrudForm, { FormSection, FormField, FormInput, FormTextarea } from '../../components/shared/CrudForm';
import orgData from '@/data/json/organization.json';

export default function OrganizationPage() {
  const org = orgData as any;
  return (
    <CrudForm title="Organización" onSave={() => {}}>
      <FormSection title="Información Institucional">
        <FormField label="Nombre de la organización">
          <FormInput defaultValue={org.name} />
        </FormField>
        <FormField label="Nombre legal">
          <FormInput defaultValue={org.legalName} />
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Descripción">
            <FormTextarea defaultValue={org.description} rows={3} />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Misión">
            <FormTextarea defaultValue={org.mission} rows={3} />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Visión">
            <FormTextarea defaultValue={org.vision} rows={3} />
          </FormField>
        </div>
      </FormSection>

      <FormSection title="Contacto">
        <FormField label="Dirección">
          <FormInput defaultValue={org.address} />
        </FormField>
        <FormField label="Teléfono">
          <FormInput defaultValue={org.phone} />
        </FormField>
        <FormField label="Email">
          <FormInput type="email" defaultValue={org.email} />
        </FormField>
        <FormField label="Sitio web">
          <FormInput defaultValue={org.website} />
        </FormField>
      </FormSection>

      <FormSection title="Redes Sociales">
        <FormField label="Facebook">
          <FormInput defaultValue={org.socialMedia?.facebook} />
        </FormField>
        <FormField label="Instagram">
          <FormInput defaultValue={org.socialMedia?.instagram} />
        </FormField>
        <FormField label="YouTube">
          <FormInput defaultValue={org.socialMedia?.youtube} />
        </FormField>
        <FormField label="Twitter/X">
          <FormInput defaultValue={org.socialMedia?.twitter} />
        </FormField>
      </FormSection>
    </CrudForm>
  );
}
