
var app = new Vue({
    el: '#app',
    store,
    data: {
        pets: null,
        currentPet: null,
    },

    created() {
        this.getPets();
    },

    methods: {
        updateProfile(pet) {
            this.$store.state.pet = pet;
            console.log("store.state.pet: " + this.$store.state.pet.name);
            this.currentPet = pet;
            this.sendCurrent(pet);
        },

        async sendCurrent(pet) {
            try {
                let response = await axios.post('/api/current', {
                    pet_id: pet._id,
                });
                console.log("current: " + response.data.pet_id);
                
            }
            catch (error) {
                console.log(error);
            }

        },

        async getPets() {
            try {
                let response = await axios.get("/api/pets");
                this.pets = response.data;
                return true;
            } catch (error) {
                console.log(error);
            }
        },
    },



});