<script setup lang="ts">
import NavBar from "../components/NavBar.vue";
import SearchBar from "../components/SearchBar.vue";
import Platforms from "../components/Platforms.vue";
import Footer from "../components/Footer.vue";
import VendorsRanking from "../components/VendorsRanking.vue";
import PostsHistory from "@/components/PostsHistory.vue";
</script>

<template>
  <NavBar></NavBar>
  <Platforms></Platforms>
  <main class="d-flex flex-column flex-grow-1 justify-content-center align-items-center">
    <div class="jumbotron jumbotron-fluid text-center my-4">
      <div class="container">
        <h1 class="display-4 font-weight-bold">
          Aquí encontrarás lo que buscas
        </h1>
        <p>Compra y vende juegos de segunda mano en GameSwap. Ve a por nuevas experiencias.</p>
      </div>
    </div>
    <SearchBar />
    <div id="carouselExampleIndicators" class="d-sm-none d-md-block carousel slide" data-bs-ride="carousel">
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" class="active"
          aria-current="true" aria-label="Slide 1"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1"
          aria-label="Slide 2"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2"
          aria-label="Slide 3"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="3"
          aria-label="Slide 4"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="4"
          aria-label="Slide 5"></button>
        <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="5"
          aria-label="Slide 6"></button>
      </div>
      <div class="carousel-inner">
        <div class="carousel-item active overflow-hidden">
          <img src="/imgs/ps4.jpeg" class="d-block mw-25 w-100 m" alt="ps4-image" />
        </div>
        <div class="carousel-item overflow-hidden">
          <img src="/imgs/gboy.webp" class="d-block mw-25 w-100" alt="gboyadv-image" />
        </div>
        <div class="carousel-item overflow-hidden">
          <img src="/imgs/snes.jpg" class="d-block w-100" alt="snes-image" />
        </div>
        <div class="carousel-item overflow-hidden">
          <img src="/imgs/play5.webp" class="d-block mw-25 w-100" alt="ps5-image" style="height: 450px;" />
        </div>
        <div class="carousel-item overflow-hidden">
          <img src="/imgs/switch.jpg" class="d-block mw-25 w-100" alt="switch-image" style="height: 450px;" />
        </div>
        <div class="carousel-item overflow-hidden">
          <img src="/imgs/xbox.png" class="d-block mw-25 w-100" alt="xbox-image" style="height: 450px;" />
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators"
        data-bs-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators"
        data-bs-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
    <div class="jumbotron jumbotron-fluid text-center my-4">
      <div class="container">
        <p>
          Súmergete en una comunidad fantástica para hacer realidad tus sueños
        </p>
      </div>
    </div>
    <VendorsRanking></VendorsRanking>
    <PostsHistory></PostsHistory>
  </main>
  <Footer></Footer>
</template>
<style scoped>
main {
  padding: 20px;
}

.jumbotron p {
  font-size: 2rem !important;
  font-weight: 300;
}

.carousel-inner {
  width: 800px;
  max-width: 800px;
}


@media screen and (max-width: 568px) {
  .carousel {
    display: none;
  }
}
</style>
