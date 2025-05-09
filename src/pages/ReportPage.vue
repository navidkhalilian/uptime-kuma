<template>
    <div class="container">
        <!-- Search box -->
        

        <!-- Data Table -->
        <table class="data-table">
            <thead>
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Message</th>
                <th>Time</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Active</th>
                <th>Retries</th>
            </tr>
            <tr>
                <th>
                    <input
                        v-model="id"
                        @input="search"
                        type="text"
                        class="search-box"
                    />
                </th>
                <th>
                    <input
                        v-model="name"
                        @input="search"
                        type="text"
                        class="search-box"
                    />
                </th>
                <th>
                    <input
                        v-model="message"
                        @input="search"
                        type="text"
                        class="search-box"
                    />
                </th>
                <th>
                    <div class="group-search-box">
                    <input
                        v-model="from"
                        @input="search"
                        type="text"
                        class="search-box"
                        placeholder="from"

                    />
                    <input
                        v-model="to"
                        @input="search"
                        type="text"
                        class="search-box"
                        placeholder="to"

                    />
                    </div>
                </th>
                <th>
                    <input
                        v-model="duration"
                        @input="search"
                        type="text"
                        class="search-box"
                    />
                </th>
                <th>
                    <input
                        v-model="status"
                        @input="search"
                        type="text"
                        class="search-box"
                    />
                </th>
                <th>
                    <input
                        v-model="active"
                        @input="search"
                        type="text"
                        class="search-box"
                    />
                </th>
                <th>
                    <input
                        v-model="retries"
                        @input="search"
                        type="text"
                        class="search-box"
                    />
                </th>
            </tr>
            </thead>
            <tbody>
            <tr v-if="loading">
                <td colspan="6">Loading...</td>
            </tr>
            <tr v-for="item in items" :key="item.id">
                <td>{{ item.id }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.msg }}</td>
                <td>{{ item.time }}</td>
                <td>{{ item.duration }}</td>
                <td>{{ item.status }}</td>
                <td>{{ item.active }}</td>
                <td>{{ item.retries }}</td>
            </tr>
            </tbody>
        </table>

        <!-- Pagination Controls -->
        <div class="pagination">
            <button :disabled="pagination.page === 1" @click="prev">Prev</button>
            <span>Page {{ pagination.page }}</span>
            <button :disabled="pagination.page >= totalPages" @click="next">Next</button>

            <!-- Page Count Dropdown -->
            <select v-model="pagination.itemsPerPage" @change="updateItemsPerPage">
                <option v-for="option in pageOptions" :key="option" :value="option">{{ option }}</option>
            </select>
            <button @click="exportToExcel">Export to Excel</button>

        </div>
    </div>
</template>


<script>
import axios from 'axios';
import * as XLSX from 'xlsx';

export default {
    data() {
        return {
            items: [],
            searchQuery: '',
            id: '',
            name: '',
            message: '',
            from: '',
            to: '',
            duration: '',
            status: '',
            active: '',
            retries: '',
            loading: true,
            totalCount: 0,
            pagination: {
                page: 1,
                itemsPerPage: 10, // Default items per page
            },
            pageOptions: [10, 25, 50, 100, 200,'any'], // Options for items per page dropdown
        };
    },
    computed: {
        totalPages() {
            return Math.ceil(this.totalCount / this.pagination.itemsPerPage);
        },
    },
    methods: {
        fetchData() {
            this.loading = true;
            axios
                .get('/api/report', {
                    params: {
                        page: this.pagination.page,
                        limit: this.pagination.itemsPerPage,
                        id: this.id,
                        name: this.name,
                        message: this.message,
                        from: this.from,
                        to: this.to,
                        duration: this.duration,
                        status: this.status,
                        active: this.active,
                        retries: this.retries
                    },
                })
                .then((response) => {
                    this.items = response.data.items;
                    this.totalCount = response.data.totalCount;
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                })
                .finally(() => {
                    this.loading = false;
                });
        },
        search() {
            this.pagination.page = 1;
            this.fetchData();
        },
        next() {
            if (this.pagination.page < this.totalPages) {
                this.pagination.page++;
                this.fetchData();
            }
        },
        prev() {
            if (this.pagination.page > 1) {
                this.pagination.page--;
                this.fetchData();
            }
        },
        updateItemsPerPage() {
            this.pagination.page = 1; // Reset to first page on items per page change
            this.fetchData();
        },
        exportToExcel() {
            if (!this.items.length) {
                alert("No data to export.");
                return;
            }

            const worksheet = XLSX.utils.json_to_sheet(this.items);
            const workbook = XLSX.utils.book_new();

            XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

            // Save file
            XLSX.writeFile(workbook, "report.xlsx");
        }
    },
    created() {
        this.fetchData();
    },
};
</script>


<style scoped>
.container {
    max-width: 100%;
    margin: auto;
    padding: 16px;
}
.search-box {
    margin-bottom: 16px;
    padding: 8px;
    width: 100%;
    font-size: 16px;
}
.group-search-box {
    display: flex;
    width: 100%;
}
.data-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 16px;
}
.data-table th,
.data-table td {
    border: 1px solid #ccc;
    padding: 8px;
    text-align: left;
}
.pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.pagination button {
    padding: 6px 12px;
}
</style>
