<template>
    <div class="level">
        <div class="level-item is-flex-grow-0"
            v-if="param.label">
            <label class="label has-text-weight-bold">
                {{ i18n(param.label) }}
            </label>
        </div>
        <div class="level-item">
            <div class="box p-1 is-flex-grow-1">
                <component :is="component"
                    :param="param"/>
            </div>
        </div>
    </div>
</template>

<script>
import { ucfirst } from '@enso-ui/strings';
import Checkbox from './params/Checkbox.vue';
import Input from './params/Input.vue';
import Date from './params/Date.vue';
import Select from './params/Select.vue';

export default {
    name: 'Param',

    components: {
        Checkbox, Input, Date, Select,
    },

    inject: ['i18n'],

    props: {
        param: {
            type: Object,
            required: true,
        },
    },

    computed: {
        component() {
            return ucfirst(this.param.type);
        },
    },
};
</script>
