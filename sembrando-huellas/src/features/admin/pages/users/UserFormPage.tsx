import CrudForm, { FormSection, FormField, FormInput, FormSelect } from '../../components/shared/CrudForm';

export default function UserFormPage() {
  return (
    <CrudForm title="Nuevo Usuario" onSave={() => {}}>
      <FormSection title="Información del Usuario">
        <FormField label="Nombre completo" required>
          <FormInput placeholder="Nombres y apellidos" />
        </FormField>
        <FormField label="Correo electrónico" required>
          <FormInput type="email" placeholder="usuario@organizacion.org" />
        </FormField>
        <FormField label="Rol" required>
          <FormSelect>
            <option value="">Seleccionar rol</option>
            <option value="admin">Administrador</option>
            <option value="editor">Editor</option>
            <option value="writer">Redactor</option>
            <option value="moderator">Moderador</option>
            <option value="guest">Invitado</option>
          </FormSelect>
        </FormField>
        <FormField label="Estado">
          <FormSelect>
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </FormSelect>
        </FormField>
      </FormSection>
    </CrudForm>
  );
}
