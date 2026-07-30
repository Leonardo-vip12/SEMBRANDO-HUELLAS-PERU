import CrudForm, { FormSection, FormField, FormInput, FormSelect, FormTextarea } from '../../components/shared/CrudForm';

export default function NewsFormPage() {
  return (
    <CrudForm title="Nueva Noticia" onSave={() => {}}>
      <FormSection title="Información General" description="Datos básicos del artículo">
        <FormField label="Título" required>
          <FormInput placeholder="Título de la noticia" />
        </FormField>
        <FormField label="Slug">
          <FormInput placeholder="url-de-la-noticia" />
        </FormField>
        <FormField label="Categoría" required>
          <FormSelect>
            <option>Reforestación</option>
            <option>Educación</option>
            <option>Investigación</option>
            <option>Comunidad</option>
            <option>Eventos</option>
          </FormSelect>
        </FormField>
        <FormField label="Estado">
          <FormSelect>
            <option value="draft">Borrador</option>
            <option value="published">Publicado</option>
            <option value="archived">Archivado</option>
          </FormSelect>
        </FormField>
      </FormSection>

      <FormSection title="Contenido">
        <div className="md:col-span-2">
          <FormField label="Resumen">
            <FormTextarea placeholder="Breve descripción de la noticia" rows={3} />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Contenido">
            <div className="min-h-[300px] rounded-lg border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-700 dark:bg-neutral-800/50">
              <p className="text-sm text-neutral-400">Editor de texto enriquecido (preparado para integración)</p>
            </div>
          </FormField>
        </div>
      </FormSection>

      <FormSection title="SEO" description="Meta tags para motores de búsqueda">
        <FormField label="Meta Title">
          <FormInput placeholder="Título para SEO" />
        </FormField>
        <FormField label="Meta Description">
          <FormTextarea placeholder="Descripción para SEO" rows={2} />
        </FormField>
        <FormField label="Slug">
          <FormInput placeholder="url-personalizada" />
        </FormField>
        <FormField label="Imagen OG">
          <FormInput placeholder="URL de la imagen" />
        </FormField>
      </FormSection>

      <FormSection title="Programación">
        <FormField label="Fecha de publicación">
          <FormInput type="date" />
        </FormField>
        <FormField label="Destacado">
          <FormSelect>
            <option value="no">No</option>
            <option value="yes">Sí</option>
          </FormSelect>
        </FormField>
      </FormSection>
    </CrudForm>
  );
}
