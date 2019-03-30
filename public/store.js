
const store = new Vuex.Store({
  state: {
    pet: null
  },

  mutations: {
      updatePet(newPet) {
          state.pet = newPet;
      }
  },

});