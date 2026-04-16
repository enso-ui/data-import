<template>
    <datepicker v-model="param.value"
        alt-input
        :placeholder="i18n(param.placeholder)"
        :alt-format="dateFormat"/>
</template>

<script>
import { Datepicker } from '@enso-ui/datepicker/bulma';
import { app as useApp } from '@enso-ui/ui/src/pinia/app';

export default {
    name: 'Date',

    components: { Datepicker },

    inject: ['i18n'],

    props: {
        param: {
            type: Object,
            required: true,
        },
    },

    computed: {
        meta() {
            return useApp().meta;
        },
        dateFormat() {
            return this.param.meta?.dateFormat
                ?? this.meta.dateFormat;
        },
    },

    created() {
        this.param.type = 'date';
    },
};
</script>
