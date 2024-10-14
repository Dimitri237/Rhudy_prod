<template>
  <div class="all">
    <div class="container monda-font animate__animated animate__fadeInLeft">
      <nav>
        <router-link to="/mesVehicules"><i class="fas fa-chevron-left"></i></router-link>
      </nav>
      <div>
        <h2 class="monda-font">Ajouter une annonce</h2>
        <p class="stext monda-font">Veuillez renseigner des informations sur tous les <br>champs ci-dessous</p>
      </div>
      <form @submit.prevent="ajouterAnnonce">
        <div class="input-field">
          <div>
            <label for="">type</label>
          </div>
          <select class="selectM" v-model="type">
            <option value="Information">Information</option>
            <option value="Recrutement">Recrutement</option>
          </select>
        </div>
        <div class="input-field">
          <div><label for="">Titre</label></div>
          <input v-model="titre" placeholder="Titre" required>
        </div>
        <div class="input-field">
          <div><label for="">Description</label></div>
          <input v-model="libelle" placeholder="Optionel">
        </div>
        <div class="input-field">
          <div><label for="">Date</label></div>
          <input type="date" v-model="date">
        </div>
        <div class="button">
          <button class="btn" type="submit">
            <span>Annuler</span>
          </button>
          <button class="btn" type="submit" :disabled="loading">
            <span class="loading-indicator" v-if="loading"></span>
            <span>Valider</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { db } from '@/config/firebaseConfig';
import { TABLE } from '@/config/constantes/tables.js';
import { setDoc, doc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

export default {
  name: 'AddDepense',
  data() {
    return {
      type: '',
      titre: '',
      libelle: '',
      statut: 'valide',
      userId: '',
      loading: false,
      isAuthenticated: false,
    };
  },
  created() {
    // Récupérer les informations d'authentification depuis le local storage
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userId = localStorage.getItem('userId');

    // Mettre à jour les données du composant avec les informations récupérées
    this.isAuthenticated = isAuthenticated === 'true';
    this.userId = userId;
  },
  methods: {
    async ajouterAnnonce() {
      this.loading = true;

      if (!this.isAuthenticated) {
        alert('Vous devez être connecté pour ajouter une annonce.');
        return;
      }
      const depense = {
        _id: uuidv4(),
        createdAt: moment().format(),
        date: moment().format(),
        description: this.libelle,
        statut: this.statut,
        type: this.type,
        titre: this.titre,
        updatedAt: moment().format(),
        userId: this.userId // Ajouter l'ID du véhicule au document de la dépense
      };
      try {
        setDoc(doc(db, TABLE.DEPENSE, depense._id), depense);

        this.loading = false;
        this.$router.push('/mesVehicules');
      } catch (error) {
        alert('Erreur lors de la création des annonces :', error);
        this.loading = false;
      }
    },
  }
};
</script>
<style scoped>
nav {
  padding-top: 10px;
}

.loading-indicator::after {
  content: "";
  display: inline-block;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  border: 3px solid #e4510c;
  border-top-color: #e4510c;
  border-bottom-color: #e4510c;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-indicator {
  display: flex;
  justify-content: center;
  height: 100px;
}

.selectI {
  color: white;
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 99.6%;
}

.selectM {
  border: 1px solid rgba(0, 0, 0, 0.2);
  width: 99.6%;
  height: 25px;
  outline: none;
}

h2 {
  font-size: 25px;
  font-weight: bold;
  color: rgba(6, 40, 61, 1);
  margin-top: 20px !important;
}

.stext {
  margin-top: -20px;
  color: rgba(0, 0, 0, 0.5);
  font-size: 13px;
}

.container {
  text-align: left;
  width: 450px;
  margin: 0 auto;
  margin-top: 30px;
  padding: 0 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  background-color: white;
  border-radius: 20px;
}

form {
  width: 100%;
}

.monda-font {
  font-family: 'Monda', sans-serif;
}

.affiche {
  width: 100%;
  height: 300px;
}

.input-field {
  margin-top: 30px;
  width: 100%;
}

.button-container {
  overflow: hidden;
}

.button-wrapper {
  display: flex;
  flex-wrap: nowrap;
  margin-top: 15px;
}

.button-wrapper .btns {
  flex-shrink: 0;
  margin-right: 10px;
  border: none;
  border: 1px solid rgba(0, 0, 0, 0.5);
  padding: 5px 25px;
  border-radius: 50px;
  color: rgba(0, 0, 0, 0.5);
  background-color: transparent;
  cursor: pointer;
}

.selected-button {
  color: rgba(51, 167, 226, 1) !important;
  border-color: rgba(51, 167, 226, 1) !important;
}

input {
  width: 98.3%;
  height: 30px;
  margin-top: 7px;
  border: none;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
  outline: none;
}

label {
  font-weight: 450;
  font-size: 17px;
  color: rgba(6, 40, 61, 1);

}

.button {
  width: 100%;
  justify-content: space-between;
  display: flex;
  padding-bottom: 30px;
}

.btn {
  margin-top: 20px;
  font-size: 15px;
  background: rgba(51, 167, 226, 1);
  border: none;
  width: 47%;
  height: 35px;
  color: white;
}

.loading-indicator::after {
  content: "";
  display: inline-block;
  width: 23px;
  height: 23px;
  border-radius: 50%;
  border: 3px solid #e4510c;
  border-top-color: #e4510c;
  border-bottom-color: #e4510c;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-indicator {
  display: flex;
  justify-content: center;
  height: 100px;
}

.btn:nth-child(1) {
  background-color: transparent;
  color: rgba(6, 40, 61, 1);
  border: 1px solid rgba(6, 40, 61, 1);
}
</style>