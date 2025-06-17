// Definir el componente de la rejilla (grid-component)
const { ref } = Vue;

const GridComponent = {
    props: {
        totalCount: {
            type: Number,
            required: true,
            default: 0
        },
        pageSize: {
            type: Number,
            required: true,
            default: 10
        },
        results: {
            type: Array,
            required: true
        }
    },
    data() {
        return {

            // page: 1,
            predefinedPageSizes: [10, 20, 30, 40, 50],
            selectedPageSize: this.pageSize,
            isCustomPageSize: false,
            customPageSize: null,
            currentPage: 1,

            showFilters: false,
            filters: [{
                field: 'name',
                operation: 'contains',
                value: '',
            }],
            //sortKey: '',
            sortConfig: {
                key: null,
                direction: null
            }
        };
    },
    watch: {
        currentPage: "fetchPageData",
        pageSize(newSize) {
            this.selectedPageSize = newSize;
        },
        selectedPageSize(newSize) {
            if (newSize !== "custom") {
                this.$emit("update-total-pages", this.totalPages);
            }
        },
        customPageSize(newSize) {
            this.$emit("update-total-pages", Math.ceil(this.totalCount / newSize || 1));
        },
        totalCount() {
            this.$emit("update-total-pages", this.totalPages);
        }
    },
    computed: {
        totalPages() {
            if (this.selectedPageSize == 'custom') {
                return Math.ceil(this.totalCount / this.customPageSize || 1);
            } else {
                return Math.ceil(this.totalCount / (this.selectedPageSize || this.PageSize) || 1);

            }
        },
        uniquemediadors() {
            return [...new Set(this.results.map(result => result.mediador))];
        },
        filteredAndSortedResults() {

            const { key, direction } = this.sortConfig;
            //const { field, operation, value } = this.filters;

            let filtered = [...this.results];

            if (this.filters) {
                //return [...this.results];
                this.filters.forEach((filter) => {
                    if (filter.field && filter.operation && filter.value) {
                        filtered = this.results.filter(result => {

                            const fieldValue = String(result[filter.field]).toLowerCase();
                            const filterValue = String(filter.value).toLowerCase();

                            switch (filter.operation) {
                                case 'contains':
                                    return fieldValue.includes(filterValue);
                                case 'starts':
                                    return fieldValue.startsWith(filterValue);
                                case 'ends':
                                    return fieldValue.endsWith(filterValue);
                                case 'equals':
                                    return fieldValue === filterValue;
                                default:
                                    return true;
                            }
                        });
                    }

                });
            }

            if (key) {
                /*const direction = this.sortConfig.direction === 'asc' ? 1 : -1;*/

                filtered.sort((a, b) => {
                    const aValue = a[key];
                    const bValue = b[key];
                    if (aValue > bValue) return direction === 'asc' ? -1 : 1;
                    if (aValue < bValue) return direction === 'asc' ? 1 : -1;
                    return 0;
                    //if (a[this.sortConfig.key] > b[this.sortConfig.key]) return direction;
                    //if (a[this.sortConfig.key] < b[this.sortConfig.key]) return -direction;
                    //return 0;

                    //let result = 0;
                    //if (a[this.sortConfig.key] > b[this.sortConfig.key]) result = 1;
                    //if (a[this.sortConfig.key] < b[this.sortConfig.key]) result = -1;
                    //return result * this.sortConfig.key;
                });
            }
            return filtered;
        },
        columns() {
            var headers = Array.from(document.querySelectorAll('#GridComponentVue th')).map(th => ({ text: th.innerText.trim(), value: th.id.trim() }));
            return headers;
        }
    },
    methods: {
        handlePageSizeChange() {
            if (this.selectedPageSize === "custom") {
                this.isCustomPageSize = true;
            } else {
                this.isCustomPageSize = false;
                this.$emit("page-size-changed", this.currentPage, parseInt(this.selectedPageSize), -1);
            }
        },
        applyCustomPageSize() {
            if (this.customPageSize > 0) {
                this.$emit("page-size-changed", this.currentPage, this.customPageSize, -1);
            }
        },
        fetchPageData() {
            this.$emit("fetch-data", this.currentPage, parseInt(this.selectedPageSize), -1);
        },
        goToPage(page) {
            if (page >= 1 && page <= this.totalPages) {
                this.currentPage = page;
            }
        },
        toggleFilters() {
            this.showFilters = !this.showFilters;
        },
        sortBy(keyField) {
            if (this.sortConfig.key === keyField) {
                var newDirection = this.sortConfig.direction === 'asc' ? 'desc' : 'asc';
                this.sortConfig = {
                    key: keyField,
                    direction: newDirection
                }
                //this.sortConfig.key *= -1; // Invertir el orden si es el mismo campo
            } else {
                this.sortConfig.key = keyField;
                this.sortConfig.direction = 'asc';
            }
        },
        getSortIndicator(key) {
            if (this.sortConfig.key === key) {
                return this.sortConfig.direction === 'asc' ? '↑' : '↓';
            }
            return '';
        },
        clasesField(key, sortable = true) {
            return "{ 'sortable' : " + sortable +
                ",'sorted-asc': " + sortConfig.key === key && sortConfig.direction === 'asc' +
                ",'sorted-desc': " + sortConfig.key === key && sortConfig.direction === 'desc' + "}"
        },
        addFilter() {
            this.filters.push({ field: '', operation: '', value: '' });
        },
        removeFilter(index) {
            this.filters.splice(index, 1);
        }
    },
    setup() {
        const sortConfig = ref({ key: '', direction: '' });
        return sortConfig;
    },
    template: `
                                <div>
                                    <div v-if="$root.isLoading" class="spinner-container">
                                        <div class="spinner-border text-danger" role="status">
                                            <span class="visually-hidden">Cargando...</span>
                                        </div>
                                        
                                    </div>
                                    <div v-else>
                                            <button v-on:click="toggleFilters" class="operations-grid"><i class="bi bi-filter">  </i> FILTROS</button>
                                            <div v-if="showFilters" class="filter-section mb-3">
                                                <div class="filter-group-popup">
                                                    <div>
                                                        <button v-on:click="addFilter"><i class="bi bi-plus">  </i></button>
                                                    </div>
                                                    <div v-for="(filter, index) in filters" :key="index"  style="{top: (index * 60) + 'px; display: flex;'}">
                                                        <div style="padding-right: 10px;">
                                                            <label for="field"> Campo:</label>
                                                            <select v-model="filter.field" id="field">
                                                                <option v-for="column in columns" :key="column.text" :value="column.value">
                                                                    {{column.text}}
                                                                </option>
                                                            </select>
                                                        </div>
                                                        <div style="padding-right: 10px;">
                                                            <label for="operation"> Operación:</label>
                                                            <select v-model="filter.operation" id="operation">
                                                                <option value="contains"> Contiene </option>
                                                                <option value="starts"> Comienza con</option>
                                                                <option value="ends"> Termina con</option>
                                                                <option value="equals"> Igual a </option>
                                                            </select>
                                                        </div>
                                                        <div style="padding-right: 10px;">
                                                            <label for="value"> Valor: </label>
                                                            <input
                                                                v-model="filter.value"
                                                                type="text"
                                                                id="value"
                                                                v-on:input="filteredAndSortedResults"/>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <button v-on:click="removeFilter"><i class="bi bi-trash">  </i></button>
                                                    </div>
                                                </div>

                                                <div class="mt-2">


                                                </div>
                                            </div>
                                        <table id="GridComponentVue" border="1" cellspacing="0" cellpadding="5" class="table table-striped">
                                        <thead>
                                            <tr>
                                                <th rowspan="2" id="fec_actu" v-if="!mostrarEjecucionFichero" v-on:click="sortBy('fec_actu')">Fecha disponible <span v-if="sortConfig.key=== 'fec_actu'">{{ getSortIndicator('fec_actu') }}</span></th>
                                                <th rowspan="2" id="cod_poliza" v-if="!mostrarEjecucionFichero" v-on:click="sortBy('cod_poliza')">Póliza <span>{{ getSortIndicator('cod_poliza') }}</span></th>

                                                <th rowspan="2" id="mediador" v-if="mostrarPolizaEconomico"  v-on:click="sortBy('mediador')">Medidador <span>{{ getSortIndicator('mediador') }}</span></th>
                                                <th rowspan="2" id="imp_pri_tot" v-if="mostrarPolizaEconomico"  v-on:click="sortBy('imp_pri_tot')">Total <span>{{ getSortIndicator('imp_pri_tot') }}</span></th>
                                                <th rowspan="2" id="imp_pri_net_bon" v-if="mostrarPolizaEconomico"  v-on:click="sortBy('imp_pri_net_bon')">Prima <span>{{ getSortIndicator('imp_pri_net_bon') }}</span></th>
                                                <th colspan="2" v-if="mostrarPolizaEconomico"> Descuentos</th>
                                                <th colspan="4" v-if="mostrarPolizaEconomico"> Cargos</th>

                                            </tr>
                                        </thead>
                                        <tbody>
                                                    <tr v-for="result in filteredAndSortedResults" :key="result.cod_poliza">
                                                    <td v-if="!mostrarEjecucionFichero">{{ result.fec_actu }}</td>
                                                    <td v-if="!mostrarEjecucionFichero">{{ result.cod_poliza }}</td>

                                                    <td v-if="mostrarPolizaGeneral">{{ result.mediador }}</td>
                                                    <td v-if="mostrarPolizaGeneral">{{ result.des_origen }}</td>
                                                    <td v-if="mostrarPolizaGeneral">{{ result.nom_ramo }}</td>
                                                    <td v-if="mostrarPolizaGeneral">{{ result.num_spto }}</td>
                                                    <td v-if="mostrarPolizaGeneral">{{ result.estado }}</td>
                                                    <td v-if="mostrarPolizaGeneral">{{ result.nom_fichero }}</td>

                                                    <td v-if="mostrarPolizaEconomico">{{ result.mediador }}</td>
                                                    <td v-if="mostrarPolizaEconomico">{{ result.imp_pri_tot }}</td>
                                                    <td v-if="mostrarPolizaEconomico">{{ result.imp_pri_net_bon }}</td>
                                                    <td v-if="mostrarPolizaEconomico">{{ result.imp_dto }}</td>
                                                    <td v-if="mostrarPolizaEconomico">{{ result.imp_boni }}</td>
                                                    <td v-if="mostrarPolizaEconomico">{{ result.imp_ips }}</td>
                                                    <td v-if="mostrarPolizaEconomico">{{ result.imp_clea }}</td>
                                                    <td v-if="mostrarPolizaEconomico">{{ result.imp_consorcio }}</td>
                                                    <td v-if="mostrarPolizaEconomico">{{ result.imp_otrcargos }}</td>

                                                    <td v-if="mostrarPolizaEstado">{{ result.mediador }}</td>
                                                    <td v-if="mostrarPolizaEstado">{{ result.nom_fichero }}</td>
                                                    <td v-if="mostrarPolizaEstado">{{ result.cod_estado }}</td>
                                                    <td v-if="mostrarPolizaEstado">{{ result.num_spto }}</td>
                                                    <td v-if="mostrarPolizaEstado">{{ result.fec_efe_spto }}</td>
                                                    <td v-if="mostrarPolizaEstado">{{ result.fec_vto_spto }}</td>
                                                    <td v-if="mostrarPolizaEstado">{{ result.fec_anul }}</td>

                                                    <td v-if="mostrarReciboGeneral">{{ result.num_recibo }}</td>
                                                    <td v-if="mostrarReciboGeneral">{{ result.mediador }}</td>
                                                    <td v-if="mostrarReciboGeneral">{{ result.des_origen }}</td>
                                                    <td v-if="mostrarReciboGeneral">{{ result.nom_ramo }}</td>
                                                    <td v-if="mostrarReciboGeneral">{{ result.movimiento }}</td>
                                                    <td v-if="mostrarReciboGeneral">{{ result.estado }}</td>
                                                    <td v-if="mostrarReciboGeneral">{{ result.nom_fichero }}</td>

                                                    <td v-if="mostrarReciboEconomico">{{ result.num_recibo }}</td>
                                                    <td v-if="mostrarReciboEconomico">{{ result.mediador }}</td>
                                                    <td v-if="mostrarReciboEconomico">{{ result.imp_tot_reci }}</td>
                                                    <td v-if="mostrarReciboEconomico">{{ result.imp_pri_net }}</td>
                                                    <td v-if="mostrarReciboEconomico">{{ result.tip_ges_cob }}</td>
                                                    <td v-if="mostrarReciboEconomico">{{ result.imp_dtos }}</td>
                                                    <td v-if="mostrarReciboEconomico">{{ result.imp_bonifica }}</td>
                                                    <td v-if="mostrarReciboEconomico">{{ result.imp_ips }}</td>
                                                    <td v-if="mostrarReciboEconomico">{{ result.imp_clea }}</td>
                                                    <td v-if="mostrarReciboEconomico">{{ result.imp_consorci }}</td>
                                                    <td v-if="mostrarReciboEconomico">{{ result.imp_otr_car }}</td>

                                                    <td v-if="mostrarReciboEstado">{{ result.num_recibo }}</td>
                                                    <td v-if="mostrarReciboEstado">{{ result.mediador }}</td>
                                                    <td v-if="mostrarReciboEstado">{{ result.nom_fichero }}</td>
                                                    <td v-if="mostrarReciboEstado">{{ result.mca_devuelto }}</td>
                                                    <td v-if="mostrarReciboEstado">{{ result.movimiento }}</td>
                                                    <td v-if="mostrarReciboEstado">{{ result.fec_efec }}</td>
                                                    <td v-if="mostrarReciboEstado">{{ result.fec_vto }}</td>

                                                    <td v-if="mostrarSiniestroGeneral">{{ result.id_siniestro }}</td>
                                                    <td v-if="mostrarSiniestroGeneral">{{ result.mediador }}</td>
                                                    <td v-if="mostrarSiniestroGeneral">{{ result.des_origen }}</td>
                                                    <td v-if="mostrarSiniestroGeneral">{{ result.nom_ramo }}</td>
                                                    <td v-if="mostrarSiniestroGeneral">{{ result.id_expediente }}</td>
                                                    <td v-if="mostrarSiniestroGeneral">{{ result.cod_estado_exp }}</td>
                                                    <td v-if="mostrarSiniestroGeneral">{{ result.nom_fichero }}</td>

                                                    <td v-if="mostrarSiniestroEconomico">{{ result.id_siniestro }}</td>
                                                    <td v-if="mostrarSiniestroEconomico">{{ result.mediador }}</td>
                                                    <td v-if="mostrarSiniestroEconomico">{{ result.id_expediente }}</td>
                                                    <td v-if="mostrarSiniestroEconomico">{{ result.nom_fichero }}</td>
                                                    <td v-if="mostrarSiniestroEconomico">{{ result.imp_tot_pag }}</td>
                                                    <td v-if="mostrarSiniestroEconomico">{{ result.imp_reserva }}</td>
                                                    <td v-if="mostrarSiniestroEconomico">{{ result.imp_tot_rec }}</td>

                                                    <td v-if="mostrarEstadoSiniestro">{{ result.id_siniestro }}</td>
                                                    <td v-if="mostrarEstadoSiniestro">{{ result.mediador }}</td>
                                                    <td v-if="mostrarEstadoSiniestro">{{ result.nom_fichero }}</td>
                                                    <td v-if="mostrarEstadoSiniestro">{{ result.cod_estado_sin }}</td>
                                                    <td v-if="mostrarEstadoSiniestro">{{ result.id_expediente }}</td>
                                                    <td v-if="mostrarEstadoSiniestro">{{ result.fec_actu_poliza }}</td>
                                                    <td v-if="mostrarEstadoSiniestro">{{ result.fec_vto_spto_poliza }}</td>
                                                    <td v-if="mostrarEstadoSiniestro">{{ result.fec_anul_poliza }}</td>

                                                    <td v-if="mostrarEjecucionFichero"> {{result.sk_fecha }} </td>
                                                    <td v-if="mostrarEjecucionFichero"> {{result.mediador }} </td>
                                                    <td v-if="mostrarEjecucionFichero"> {{result.des_origen }} </td>
                                                    <td v-if="mostrarEjecucionFichero"> {{result.nom_fichero }} </td>
                                                    <td v-if="mostrarEjecucionFichero"> {{result.proceso }} </td>
                                                    <td v-if="mostrarEjecucionFichero"> {{result.formato }} </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <nav>

                                        <div class="pagination">
                                            <button class="bg-transparent" v-on:click="this.goToPage(currentPage - 1)" :disabled="currentPage===1">
                                                    <i class="bi bi-chevron-left"></i>
                                            </button>
                                            <span class="d-flex align-items-center"> {{totalCount}} resultados. Página {{currentPage}} de {{totalPages}} </span>
                                            <button class="bg-transparent" v-on:click="this.goToPage(currentPage + 1)" :disabled="currentPage===totalPages">
                                                <i class="bi bi-chevron-right"></i>
                                            </button>
                                            <div class="page-size-selector">
                                                <label for="pageSize"> Filas por página:</label>
                                                <select v-model="selectedPageSize" v-on:change="handlePageSizeChange">
                                                    <option v-for="size in predefinedPageSizes" :key="size" :value="size">{{size}} </option>
                                                    <option :value="'custom'">Otro...</option>
                                                </select>

                                                <!-- Cuadro de texto para tamaño personalizado -->
                                                <input
                                                    v-if="isCustomPageSize"
                                                    type="number"
                                                    min="1"
                                                    v-model.number="customPageSize"
                                                    v-on:blur="applyCustomPageSize"
                                                    placeholder="Ingrese un tamaño"
                                                />
                                            </div>
                                        </div>
                                        
                                    </nav>
                                </div>
                        </div>
                `
};
//GridComponent.mount('#Grid-Component');