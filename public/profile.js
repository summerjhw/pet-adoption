var app = new Vue({
    el: '#profile',
    data: {
        pet: null,
    },

    created() {
        this.getPet();
        console.log("created!");
    },

    methods: {
        async getPet() {
            try {
                let res1 = await axios.get('/api/current');
                if (res1.data.length != 1) {
                    return;
                }

                console.log(res1.data);
                pet_id = res1.data[0].pet_id;
                console.log( pet_id);

                let res2 = await axios.get('/api/pets/' + pet_id);
                this.pet = res2.data;
                console.log("Pet: " + this.pet.name);
            }
            catch (error) {
                console.log(error);
            }
        },
    }


});