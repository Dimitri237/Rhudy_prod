<template>
  <div class="all">
    <div class="container monda-font animate__animated animate__fadeInLeft">
      <nav>
        <router-link to="/mesVehicules"><i class="fas fa-chevron-left"></i></router-link>
      </nav>
      <div>
        <h2 class="monda-font">Ajouter un véhicule</h2>
        <p class="stext monda-font">Veuillez renseigner des informations sur tous les <br>champs ci-dessous</p>
      </div>
      <form @submit.prevent="ajouterVehicule">
        <div class="input-field">
          <div><label for="">Marque véhicule</label></div>
          <select class="selectM" name="" v-model="marque" id="marques-select">
            <option v-for="marque in marques" :value="marque._id" v-bind:key="marque._id">{{ marque.libelle }}</option>
          </select>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
          <div style="width: 47%;">
            <div><label for="">Modele véhicule</label></div>
            <select class="selectM" name="" v-model="modele" id="modeles-select">
              <option v-for="modele in modeles" :value="modele._id" v-bind:key="modele._id">{{ modele.libelle }}
              </option>
            </select>
          </div>
          <div style="width: 47%;">
            <div><label for="">Annee véhicule</label></div>
            <select class="selectM" name="" v-model="annee" id="annees-select">
              <option v-for="a in annees" :value="a" v-bind:key="a">{{ a }}</option>
            </select>
          </div>
        </div>

        <div class="input-field">
          <div><label for="">Couleur</label></div>
          <input class="input" v-model="color" placeholder="Rouge, Jaune, verte ...etc" required>
        </div>
        <div class="input-field">
          <div><label for="">Immatriculation</label></div>
          <input class="input" v-model="id" placeholder="CMD4AS5" required>
        </div>
        <div class="input-field">
          <div><label for="password">Ajouter des images</label></div>
          <div style=" display: flex; justify-content: space-between;">
            <div class="inbox">
              <input class="box" type="file" accept="image/*" @change="onFileSelected" id="image">
              <img v-if="selectedImage" :src="selectedImageURL" alt="Aperçu de l'image" class="affiche">
            </div>
            <div class="inbox">
              <input class="box" type="file" accept="image/*" @change="onFileSelected1" id="image1">
              <img v-if="selectedImage1" :src="selectedImageURL1" alt="Aperçu de l'image" class="affiche">
            </div>
            <div class="inbox">
              <input class="box" type="file" accept="image/*" @change="onFileSelected2" id="image2">
              <img v-if="selectedImage2" :src="selectedImageURL2" alt="Aperçu de l'image" class="affiche">
            </div>
          </div>
        </div>
        <div class="button">
          <button class="btn" type="submit">
            <span>Annuler</span>
          </button>
          <button class="btn" type="submit" :disabled="loading">
            <span class="loading-indicator" v-if="loading"></span>
            <span v-else>Valider</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import { db, firestore, uploadToFirebase } from '@/config/firebaseConfig';
import { collection, setDoc, doc, getDocs } from 'firebase/firestore';
import { TABLE } from '@/config/constantes/tables.js';
import moment from 'moment';

export default {
  name: 'AddVehicle',

  data() {
    return {
      id: '',
      marque: '',
      modele: '',
      color: '',
      loading: false,
      createdAt: moment().format(),
      updatedAt: moment().format(),
      fileName1: '',
      fileName2: '',
      fileName3: '',
      selectedImage: null,
      selectedImageURL: null,
      selectedImage1: null,
      selectedImageURL1: null,
      selectedImage2: null,
      isAuthenticated: false,
      selectedImageURL2: null,
      userId: null,
      marques: [],
      modeles: [],
      annees: [],
      annee: [],
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
  mounted() {
    try {
      const date = new Date();

      for (let index = date.getFullYear() - 24; index <= date.getFullYear(); index++) {
        this.annees.push(index);
      }

      // Récupérer les marques depuis la base de données Firestore
      getDocs(collection(firestore, TABLE.CAR_MARQUE)).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const marque = { _id: doc.id, ...doc.data() }
          this.marques.push(marque);
        });
      });

      // Récupérer les modèles depuis la base de données Firestore
      getDocs(collection(db, TABLE.CAR_MODEL)).then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const modele = { _id: doc.id, ...doc.data() };
          this.modeles.push(modele);
        });
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des marques :', error);
    }
  },
  methods: {
    async ajouterVehicule() {
      this.loading = true;

      if (!this.isAuthenticated) {
        alert('Vous devez être connecté pour ajouter un véhicule.');
        return;
      }

      try {
        const imageUrls = [];

        if (this.selectedImage) {
          const imageUrl = await uploadToFirebase(this.selectedImage, this.fileName1);
          imageUrls.push(imageUrl);
        }

        if (this.selectedImage1) {
          const imageUrl1 = await uploadToFirebase(this.selectedImage1, this.fileName2);
          imageUrls.push(imageUrl1);
        }

        if (this.selectedImage2) {
          const imageUrl2 = await uploadToFirebase(this.selectedImage2, this.fileName3);
          imageUrls.push(imageUrl2);
        }

        const vehicle = {
          _id: this.id, // Veuillez spécifier la source de cet ID (_id)
          marque: this.marques.find(m => m._id === this.marque),
          model: this.modeles.find(m => m._id === this.modele),
          annee: this.annee,
          color: this.color,
          userId: this.userId,
          images: imageUrls.map(url => ({ createdAt: moment().format(), url })),
          createdAt: this.createdAt,
          updatedAt: this.updatedAt
        };

        await setDoc(doc(firestore, TABLE.CAR, vehicle._id), { ...vehicle });
        // Réinitialiser les champs du formulaire
        this.$router.push("/mesVehicules");
      } catch (error) {
        console.error('Erreur lors du téléchargement de l\'image :', error);
      } finally {
        this.loading = false;
      }
    },
    onFileSelected(event) {
      this.selectedImage = event.target.files[0];
      this.fileName1 = this.selectedImage.name;
      this.selectedImageURL = URL.createObjectURL(this.selectedImage);
    },
    onFileSelected1(event) {
      this.selectedImage1 = event.target.files[0];
      this.fileName2 = this.selectedImage1.name;
      this.selectedImageURL1 = URL.createObjectURL(this.selectedImage1);
    },
    onFileSelected2(event) {
      this.selectedImage2 = event.target.files[0];
      this.fileName3 = this.selectedImage2.name;
      this.selectedImageURL2 = URL.createObjectURL(this.selectedImage2);
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
  color: rgba(0, 0, 0, 0.2);
  font-size: 13px;
}

.container {
  text-align: left;
  width: 450px;
  margin: 0 auto;
  margin-top: 30px;
  padding: 0 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
}

form {
  width: 100%;
}

.monda-font {
  font-family: 'Monda', sans-serif;
}

.inbox {
  width: 29%;
}

.affiche {
  width: 100px;
  height: 100px;
  padding: 10px;
  background-color: white;
  margin-left: 2px;
  margin-top: 15px;
  border-radius: 20px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
}

.input-field {
  margin-top: 30px;
  width: 100%;
}

.input {
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

/*type file*/
.box {
  font-size: 15px;
  background: white;
  border-radius: 15px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  width: 100%;
  outline: none;
}

::-webkit-file-upload-button {
  color: white;
  background: rgba(51, 167, 226, 1);
  padding: 10px;
  border: none;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  outline: none;
}

::-webkit-file-upload-button:hover {
  background: rgba(51, 168, 226, 0.678);
}

.btn:nth-child(1) {
  background-color: transparent;
  color: rgba(6, 40, 61, 1);
  border: 1px solid rgba(6, 40, 61, 1);
}
</style>