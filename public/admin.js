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
    },

    methods: {
        addAtt() {
            console.log("entered addAtt!");

            if (this.att === null) { return; }
            this.attributes.push(this.att);
            console.log("added attribute!" + this.att);
            this.att = null;
        },

        fileChanged(event) {
            console.log("file changed!")
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
                this.pet = r2.data;
                this.attributes = [];
                this.name = "";
                this.species = "";
                console.log(" pet / r2.data: " + this.pet)
            } catch (error) {
                console.log(error);
            }
        },
    }

});