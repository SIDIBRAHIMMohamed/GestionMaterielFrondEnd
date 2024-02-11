

<script>




export default{
  props : ['userName', 'userPrenom','userRole'],


  data() {
    return {
      isActive: false
    };
  },
  methods: {
    toggleNavbar() {
      this.isActive = !this.isActive;
      
    }
  }
};

</script>


<template>
 
 <nav class="navbar">
    <div class="navbar-brand">
      <a class="navbar-item" href="/users">
        Reservation
      </a>
    </div>
    <div class="navbar-menu" :class="{ 'is-active': isActive }">
      <div class="navbar-end">
        <a class="navbar-item" href="/">login</a>
        <a class="navbar-item" href="/users">Materiaux</a>
        <p>{{ console.log(userRole) }}</p>
        <a v-if="userRole === '1'" class="navbar-item" href="/admin">Utilisateurs</a>
       
      </div>
      <span><p>Bienvenu {{userName}}  {{userPrenom}}</p></span>
    </div>


  </nav>


</template>



<style>

.navbar {
  background-color: #51AA56; /* Set background color */
  color: #FDFFFC; /* Set text color */
  
  padding: 2vw;
  margin-bottom: 2vw;
  display: flex;
  justify-content: flex-start;


}

.navbar-brand .navbar-item {
  color: #FDFFFC; /* Set text color for brand */
}

.navbar-menu .navbar-item {
  color: #FDFFFC; /* Set text color for menu items */
}


.navbar-end {
  display: flex;
  flex-direction: row;
  margin-right: 5vw;
  justify-content: flex-start;
  margin-top : 0.9vw;
}
.navbar-menu {
  display: flex;
  align-self: flex-start;
}

.navbar-item {
  margin-right: 2vw;
}

.navbar-menu > span {
  margin-left: 25vw;
  margin-top : 0.7vw;
  font-style: italic;
  font-size:larger;
}



a {
  text-decoration: none;
}
</style>