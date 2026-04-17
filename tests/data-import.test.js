import { describe, expect, it, vi } from 'vitest';

vi.mock('@enso-ui/ui/src/pinia/app', () => ({
    app: () => ({
        meta: {
            dateFormat: 'd.m.Y',
        },
    }),
}));

vi.mock('@enso-ui/enums/src/pinia/enums', () => ({
    enums: () => ({
        enums: {
            importCssClasses: {
                _get: vi.fn(() => 'is-info'),
            },
        },
    }),
}));

vi.mock('@enso-ui/datepicker/bulma', () => ({
    Datepicker: {},
    EnsoDateFilter: {},
}));

vi.mock('@enso-ui/filters/bulma', () => ({
    EnsoDateFilter: {},
}));

vi.mock('@enso-ui/tables/bulma', () => ({
    EnsoTable: {},
}));

vi.mock('@enso-ui/select/bulma', () => ({
    EnsoSelect: {},
}));

vi.mock('@enso-ui/users', () => ({
    Avatar: {},
}));

vi.mock('../src/bulma/pages/dataImport/components/ImportUploader.vue', () => ({
    default: {},
}));

vi.mock('../src/bulma/pages/dataImport/components/Param.vue', () => ({
    default: {},
}));

import Date from '../src/bulma/pages/dataImport/components/params/Date.vue';
import Index from '../src/bulma/pages/dataImport/Index.vue';

describe('data import state access', () => {
    it('uses app store directly in date param', () => {
        expect(Date.computed.dateFormat.call({
            param: { meta: {} },
            meta: { dateFormat: 'd.m.Y' },
        })).toBe('d.m.Y');
    });

    it('compiles data import index with enum store access', () => {
        expect(Index).toBeTruthy();
    });
});
