export type SectionField = {
  id: string;
  name: string;
  type: FieldType;
  defaultValue: any;
  isEditable?: boolean;
  options?: string[];
};

export type TemplateSection = {
  id: string;
  name: string;
  fields: SectionField[];
};

export type SystemTemplate = {
  id: string;
  name: string;
  description: string;
  sections: TemplateSection[];
};

export type FieldType = 'number' | 'text' | 'textarea' | 'boolean' | 'select';

export const DND_TEMPLATE: SystemTemplate = {
  id: 'template_dnd_v1',
  name: 'Ficha D&D Clássico',
  description:
    'Um modelo de ficha para jogos de RPG de fantasia, com atributos básicos, habilidades e inventário.',
  sections: [
    {
      id: 'sec_atributos',
      name: 'Atributos',
      fields: [
        {
          id: 'field_for',
          name: 'For',
          type: 'number',
          defaultValue: 10,
        },
        {
          id: 'field_des',
          name: 'Des',
          type: 'number',
          defaultValue: 10,
        },
        {
          id: 'field_con',
          name: 'Con',
          type: 'number',
          defaultValue: 10,
        },
        {
          id: 'field_int',
          name: 'Int',
          type: 'number',
          defaultValue: 10,
        },
        {
          id: 'field_sab',
          name: 'Sab',
          type: 'number',
          defaultValue: 10,
        },
        {
          id: 'field_car',
          name: 'Car',
          type: 'number',
          defaultValue: 10,
        },
        {
          id: 'field_death',
          name: 'Dead?',
          type: 'boolean',
          defaultValue: true,
        },
      ],
    },
    {
      id: 'sec_dados',
      name: 'Dados do Personagem',
      fields: [
        {
          id: 'field_nome',
          name: 'Nome do Personagem',
          type: 'text',
          defaultValue: 'Aventureiro Sem Nome',
        },
        {
          id: 'field_classe',
          name: 'Classe',
          type: 'select',
          defaultValue: 'Mago',
          options: ['Guerreiro', 'Mago', 'Ladrão', 'Clérigo'],
        },
        {
          id: 'field_nivel',
          name: 'Nível',
          type: 'number',
          defaultValue: 1,
        },
        {
          id: 'field_descricao',
          name: 'Descrição',
          type: 'textarea',
          defaultValue: 'O Lendário Aventureiro Sem Nome, um poderoso Mago com grandes poderes.'
        }
      ],
    },
    {
      id: 'sec_inventario',
      name: 'Inventário',
      fields: [
        {
          id: 'field_itens',
          name: 'Itens Carregados',
          type: 'textarea',
          defaultValue: '1 poção de cura, 1 saco de dormir, 10 rações de viagem',
        },
        {
          id: 'field_moedas',
          name: 'Moedas de Ouro',
          type: 'number',
          defaultValue: 0,
        },
      ],
    },
  ],
};
