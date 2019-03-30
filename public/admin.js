var app = new Vue({
    el: '#admin',
    data: {
        name: "",
        species: "",
        file: null,
        description: "",
        att: null,
        attributes: [],
        pet: null,

        //for editing:
        editName: "",
        editSpecies: "",
        eAtt: "",
        eAttributes:[],
        editDescription: "",

        allPets: [],
        editPet: null,
    },


    created() {
        this.getPets();
    },

    computed: {
        suggestions() {
            return this.allPets.filter(pet => pet.name.toLowerCase().startsWith(this.editName.toLowerCase()));
        }
    },

    methods: {

        selectPet(pet) {
            this.editName = "";
            this.editPet = pet;
        },

        addAtt() {
            console.log("entered addAtt!");

            if (this.att === null) { return; }
            this.attributes.push(this.att);
            console.log("added attribute!" + this.att);
            this.att = null;
        },

        addEAtt() {
            if (this.eAtt === null) {return;}
            this.eAttributes.push(this.eAtt);
            this.eAtt = null;
        },

        fileChanged(event) {
            console.log("file editd!")
            //event.target.files: sometimes users can upload multiple files. This only lets you upload one. If others are selected they are ignored. 
            this.file = event.target.files[0]
            console.log("file: " + this.file)
        },

        async create() {
            try {
                console.log("creating pet profile..")
                console.log("file name:" + this.file.name)
                const formData = new FormData();
                formData.append('photo', this.file, this.file.name)
                //uploads photo
                let r1 = await axios.post('/api/photos', formData);
                console.log("r1.data.path: " + r1.data.path)
                // uploads title info and the path on the server where the photo was uploaded to.
                let r2 = await axios.post('/api/pets', {
                    name: this.name,
                    species: this.species,
                    path: r1.data.path,
                    description: this.description,
                    attributes: this.attributes,
                    adopted: false,
                });
                console.log("recieved r2!")
                this.clear();
                this.getPets();
                console.log(" pet / r2.data: " + this.pet)
            } catch (error) {
                console.log(error);
            }
        },

        clear() {
            this.name = "";
            this.species = "";
            this.file = null;
            this.description = "";
            this.att = null;
            this.attributes = [];
            this.editName = "";
            this.editPet = null;
            this.editSpecies = "";
            this.eAtt = "";
            this.editDescription = "";
            this.eAttributes = [];

        },

        async getPets() {
            try {
                let response = await axios.get("/api/pets");
                this.allPets = response.data;
                return true;
            } catch (error) {
                console.log(error);
            }
        },

        async deletePet(pet) {
            try {
                let response = axios.delete("/api/pets/" + pet._id);
                this.clear();
                this.getPets();
                return true;
            } catch (error) {
                console.log(error);
            }
        },

        async uploadPet(pet) {

            try {
                name = this.editName;
                description = this.editDescription;
                species = this.editSpecies;

                if (name === "") {
                    name = pet.name;
                }
                if (description === "") {
                    description = pet.description;
                }
                if(species === ""){
                    species = pet.species;
                }

                attr = pet.attributes.concat(this.eAttributes);
                let response = await axios.put("/api/pets/" + pet._id, {
                    name: name,
                    species:species,
                    description: description,
                    attributes:attr,
                    adopted:false,

                });
                this.clear();
                this.getPets();
                return true;
            } catch (error) {
                console.log(error);
            }
        },
    }

});