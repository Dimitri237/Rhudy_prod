<template>
    <div class="all">
        <side_barre />
        <div class="container">

            <div v-if="loading" class="loading-indicator">
                <!-- Indicateur de chargement, vous pouvez personnaliser cet élément -->
            </div>
            <div v-else>
                <div class="car">
                    <router-link to="/mesVehicules"><i style="margin-top: 15px; color: #e4510cc9;"
                            class="fas fa-chevron-left"></i></router-link>
                    <div class="" style="display: block;">
                        <div class="button-container" ref="buttonContainer">
                            <div class="image button-wrapper"
                                ref="this.$refs.buttonContainer.scrollLeft = this.scrollLeft - deltaX;">
                                <img class="slide" v-for="image in vehicle.images" :key="image.id" :src="image.url"
                                    alt="Image de la voiture"
                                    style="margin-top: 10px; border-radius: 10px; height: auto;" />
                            </div>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <h4 v-for="vehicle in vehicles" :key="vehicle.id" style="color: #e4510cc9;">{{
                                vehicle.marque.libelle }} {{ vehicle.model.libelle }} {{ vehicle.annee }}</h4>
                            <h4 style="color: #e4510c;">{{ formatNumber(totalDepenses) }}</h4>
                        </div>
                    </div>

                </div>

                <ul>
                    <li class="animate__animated animate__fadeInUp" v-for="depense in depenses" :key="depense.id">
                        <div style="display: flex;">
                            <p>Type de dépense : </p><span> {{ findTypeDepenseById(depense.type_depense) }}</span>
                        </div>
                        <div style="display: flex; margin-top: -20px;">
                            <p>Montant : </p><span> {{ formatNumber(depense.montant) }}</span>
                        </div>
                        <div style="display: flex; margin-top: -20px;">
                            <p>Date : </p><span v-text="formatDate(depense.date)"></span>
                        </div>
                    </li>
                </ul>
            </div>
            <button @click="newSpend" to="/ajouterD" class="new_spend">
                <img style="width: 50px; height: 50px; margin: auto 10px;" src="@/assets/icon (4).png" alt="">
                <div style="margin: auto 10px; width: 500px;">
                    <h3>Ajouter une dépense</h3>
                </div>
            </button>
            <div class="spendModale" v-if="addSpend">
                <ajouterD />
            </div>
        </div>
    </div>
</template>

<script>
import { collection, getDocs, where, query } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';
import { TABLE } from '@/config/constantes/tables.js';
import side_barre from '@/components/layouts/side_barre.vue';
import ajouterD from '@/components/ajouterD.vue';
import moment from 'moment';


export default {
    components: {
        side_barre,
        ajouterD
    },
    data() {
        return {
            depenses: [],
            vehicle: [],
            typeDepenses: [],
            loading: false,
            vehicles: [],
            addSpend: false,
        };
    },
    mounted() {
        const vehicleId = this.$route.params.id;
        this.fetchDepenses(vehicleId);
        this.findTypeDepense();
        this.getVehicleById(vehicleId);
    },
    computed: {
        // Calcul de la somme totale des dépenses
        formattedTotalDepenses() {
            return this.formatNumber(this.totalDepenses,);
        },
        totalDepenses() {
            return this.depenses.reduce((total, depense) => total + depense.montant, 0);
        }
    },
    methods: {
        newSpend(){
            this.addSpend = true;
        },
        formatDate(date) {
            return moment(date).format('YYYY-MM-DD'); // Remplacez 'YYYY-MM-DD' par le format de date souhaité
        },
        formatNumber(number) {
            const formattedNumber = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            return formattedNumber;
        },
        async getVehicleById(vehicleId) {
            try {
                this.loading = true;
                const q = query(collection(db, TABLE.CAR), where('_id', '==', vehicleId));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    this.vehicle = querySnapshot.docs[0].data();
                    this.vehicles = querySnapshot.docs.map((doc) => doc.data());
                    localStorage.setItem('vehicleIds', JSON.stringify(this.vehicles.map((vehicle) => vehicle._id)));

                } else {
                    console.log('Le véhicule n\'existe pas.');
                }
                this.loading = false;
            } catch (error) {
                console.error('Erreur lors de la récupération du véhicule :', error);
            }
        },
        async fetchDepenses(vehicleId) {
            try {
                this.loading = true;
                const q = query(collection(db, TABLE.DEPENSE), where('vehiculeId', '==', vehicleId));
                const querySnapshot = await getDocs(q);
                this.depenses = querySnapshot.docs.map((doc) => doc.data());
                this.loading = false;
            } catch (error) {
                console.error('Erreur lors de la récupération des dépenses :', error);
            }
        },
        async findTypeDepense() {
            try {
                const q = query(collection(db, TABLE.TYPE_DEPENSE));
                const querySnapshot = await getDocs(q);
                this.typeDepenses = querySnapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() }));
            } catch (error) {
                console.error('Erreur lors de la récupération des informations du véhicule :', error);
            }
        }, findTypeDepenseById(id) {
            const typeDepense = this.typeDepenses.find(type => type._id === id);
            return typeDepense ? typeDepense.libelle : '';
        }

    },
};
</script>
<style scoped>
@import url(https://fonts.googleapis.com/css2?family=Monda:wght@100;200;300;400;500;600;700&display=swap);

body {
    width: 100%;
    padding: 0;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.5) !important;
    font-family: Monda;
}
.spendModale{
    position: absolute;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    top: 0;
    left: 0;
}

.new_spend {
    width: 20%;
    top: 89%;
    left: 79%;
    display: flex;
    text-decoration: none;
    justify-content: space-between;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    position: absolute;
    border: none;
    background-color: rgba(0, 0, 0, 0.04);
}

.car {
    background-color: rgba(0, 0, 0, 0.05);
    width: 95%;
    padding: 0 2.5%;
    display: block;
    margin: auto;
    border-radius: 15px;
}

.all {
    background-color: rgba(0, 0, 0, 0.05) !important;
    width: 100%;
    margin: 0;
    padding: 0;
    display: flex !important;
    font-family: Monda;
}

.detail {
    width: 95%;
    margin: auto;
}

h3 {
    color: #e4510c;
}

p {
    color: #e4510c;
    font-size: 12px;
}

.head {
    width: 37.5%;
    position: fixed;
    top: 7px;
    background-color: #ffffff;
    z-index: 9999;
}

.new_car {
    width: 100%;
    display: flex;
    text-decoration: none;
    justify-content: space-between;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
}

ul {
    padding: 0;
    width: 100%;
}

li {
    width: 100%;
    list-style: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}

.container {
    width: 40%;
    margin-left: 5%;
    background-color: white;
    padding: 20px;
    height: 94.6vh;
    overflow-y: auto;
    font-family: Monda;
}

.container::-webkit-scrollbar {
    width: 0.1em;
    /* Largeur de la barre de défilement */
}

.container::-webkit-scrollbar-thumb {
    background-color: transparent;
    /* Couleur de la poignée de défilement */
}

h4 {
    font-size: 15px;
    color: #e4510c;
    display: flex;
}

p {
    width: 50%;
}


.loading-indicator {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    margin-top: 200px;
}

.loading-indicator::after {
    content: "";
    display: inline-block;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    border: 3px solid #e4510c;
    border-top-color: #e4510c;
    border-bottom-color: #e4510c;
    animation: spin 1s linear infinite;
}

.image {
    display: flex;
    justify-content: space-between;
}

.image img {
    width: 32% !important;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

span {
    color: #e4510c;
    font-weight: bold;
    margin: auto;
    width: 50%;
    text-align: right;
}
</style>