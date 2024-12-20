<template>
    <div class="wrapper">
        <div class="columns is-variable is-2 is-mobile is-multiline">
            <div class="column is-3-desktop is-half-touch">
                <enso-select v-model="type"
                    :options="options"
                    placeholder="Import Type"
                    @update:model-value="type ? template() : null"/>
            </div>
            <template v-if="type">
                <div v-for="param in params"
                    class="column is-3-desktop is-half-touch"
                    :key="param.name">
                    <slot :name="param.name"
                        v-if="param.type === 'slot'"/>
                    <Param :param="param"
                        v-else/>
                </div>
                <div class="column"/>
                <div class="column is-narrow">
                    <import-uploader template
                        :path="importLink"
                        :params="uploadParams"
                        @upload-successful="$refs.imports.fetch()"/>
                </div>
            </template>
        </div>
        <div class="columns is-centered">
            <div class="column is-narrow">
                <enso-date-filter class="box raises-on-hover"
                    compact
                    v-model:filter="dateFilter"
                    v-model:interval="intervals.data_imports.created_at"/>
            </div>
        </div>
        <enso-table class="box is-paddingless raises-on-hover"
            id="dataImports"
            :filters="filters"
            :intervals="intervals"
            @download-rejected="rejected"
            ref="imports">
            <template #type="{ column, row }">
                <span class="tag is-table-tag is-info">
                    {{ column.enum._get(row.type) }}
                </span>
            </template>
            <template #entries="{ row }">
                <strong class="has-text-info">
                    {{ row.entries || '-' }}
                </strong>
            </template>
            <template #successful="{ row }">
                <strong class="has-text-success">
                    {{ row.successful === null ? '-' : row.successful }}
                </strong>
            </template>
            <template #failed="{ row }">
                <strong class="has-text-danger">
                    {{ row.failed === null ? '-' : row.failed }}
                </strong>
            </template>
            <template #status="{ column, row }">
                <span :class="['tag is-table-tag', enums.importCssClasses._get(row.status)]">
                    {{ column.enum._get(row.status) }}
                </span>
            </template>
            <template #createdBy="{ row }">
                <avatar class="is-24x24"
                    :user="row.createdBy"/>
            </template>
        </enso-table>
    </div>
</template>

<script setup>
import {
    inject, ref, computed, onBeforeMount, reactive,
} from 'vue';
import { useStore } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faDownload, faTrashAlt, faFileExcel, faBan, faSync,
} from '@fortawesome/free-solid-svg-icons';
import { EnsoTable } from '@enso-ui/tables/bulma';
import { EnsoSelect } from '@enso-ui/select/bulma';
import { Avatar } from '@enso-ui/users';
import { EnsoDateFilter } from '@enso-ui/filters/bulma';
import ImportUploader from './components/ImportUploader.vue';
import Param from './components/Param.vue';

library.add(faDownload, faTrashAlt, faFileExcel, faBan, faSync);

const canAccess = inject('canAccess');
const errorHandler = inject('errorHandler');
const http = inject('http');
const route = inject('route');

const dateFilter = ref('all');

const intervals = reactive({
    data_imports: {
        created_at: {
            max: null,
            min: null,
        },
    },
});

const type = ref(null);
const params = ref([]);
const options = ref([]);
const store = useStore();

const { enums } = store.state;

const filters = computed(() => ({ data_imports: { type: type.value } }));

const importLink = computed(() => canAccess('import.store')
    && type.value
    && route('import.store'));

const uploadParams = computed(() => params.value.reduce((params, param) => {
    params[param.name] = param.value;
    return params;
}, { type: type.value }));

onBeforeMount(() => http.get(route('import.options'))
    .then(({ data }) => (options.value = data))
    .catch(errorHandler));

const template = () => http.get(route('import.show', type.value))
    .then(({ data }) => (params.value = data.params))
    .catch(error => {
        type.value = null;
        errorHandler(error);
    });

const rejected = ({ rejected: { id } }) => (window.location.href = route('import.rejected', id));

</script>
