import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
} from '@angular/core';
import {
  DND_TEMPLATE,
  FieldType,
  SectionField,
  SystemTemplate,
  TemplateSection,
} from '../../Types/SystemTemplate.type';
import { UtilsService } from '../../Services/utils.service';
import { PButtonComponent } from '../Buttons/p-button/p-button.component';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TextareaFieldComponent } from '../SheetFields/textarea-field/textarea-field.component';
import { TextFieldComponent } from '../SheetFields/text-field/text-field.component';
import { NumberFieldComponent } from '../SheetFields/number-field/number-field.component';
import { BooleanFieldComponent } from '../SheetFields/boolean-field/boolean-field.component';
import { SelectFieldComponent } from '../SheetFields/select-field/select-field.component';

@Component({
  selector: 'app-template-creator',
  imports: [
    PButtonComponent,
    ReactiveFormsModule,
    CommonModule,
    TextareaFieldComponent,
    TextFieldComponent,
    NumberFieldComponent,
    BooleanFieldComponent,
    SelectFieldComponent,
  ],
  templateUrl: './template-creator.component.html',
})
export class TemplateCreatorComponent {
  utils = inject(UtilsService);

  @Input() selectedTemplate: SystemTemplate = DND_TEMPLATE;

  testTemplate: SystemTemplate = DND_TEMPLATE;

  showAddSection: boolean = false;
  showAddField: boolean = false;

  sectionForm = new FormGroup({
    sectionName: new FormControl(''),
  });

  fieldForm = new FormGroup({
    fieldName: new FormControl(''),
    fieldType: new FormControl<FieldType>('text'),
    fieldDefaultValue: new FormControl<any>(''),
    fieldOptions: new FormControl<string | null>(null),
  });

  addSectionEnd(event: Event) {
    event.preventDefault();
    const sectionName = this.sectionForm.get('sectionName')?.value;
    if (sectionName) {
      const newSection: TemplateSection = {
        id: `sec_${sectionName.trim().replaceAll(' ', '-')}`,
        name: sectionName,
        fields: [],
      };
      this.selectedTemplate.sections.push(newSection);
      this.sectionForm.get('sectionName')?.setValue('');
      this.showAddSection = false;
    }
  }

  addSectionStart(event: Event) {
    event.preventDefault();
    const sectionName = this.sectionForm.get('sectionName')?.value;
    if (sectionName) {
      const newSection: TemplateSection = {
        id: `sec_${sectionName.trim().replaceAll(' ', '-')}`,
        name: sectionName,
        fields: [],
      };
      this.selectedTemplate.sections.unshift(newSection);
      this.sectionForm.get('sectionName')?.setValue('');
      this.showAddSection = false;
    }
  }

  addFields(event: Event, section: TemplateSection) {
    event.preventDefault();
    const fieldName = this.fieldForm.get('fieldName')?.value;
    const fieldType = this.fieldForm.get('fieldType')?.value;
    const fieldDefaultValue = this.fieldForm.get('fieldDefaultValue')?.value;
    const fieldOptions = this.fieldForm.get('fieldOptions')?.value;

    if (fieldName && fieldType) {
      const newField: SectionField = {
        id: `field_${fieldName.trim().replaceAll(' ', '-')}`,
        name: fieldName,
        type: fieldType,
        defaultValue:
          fieldType === 'select'
            ? fieldOptions
              ? fieldOptions[0]
              : fieldDefaultValue
            : fieldDefaultValue,
        isEditable: true,
        options: fieldType === 'select' ? fieldOptions?.split(',') : undefined,
      };

      section.fields.push(newField);

      this.fieldForm.get('fieldName')?.setValue('');
      this.fieldForm.get('fieldType')?.setValue('text');
      this.fieldForm.get('fieldDefaultValue')?.setValue('');
      this.fieldForm.get('fieldOptions')?.setValue(null);
    }
  }
  printSheet() {
    console.log(JSON.stringify(this.selectedTemplate));
  }
}
