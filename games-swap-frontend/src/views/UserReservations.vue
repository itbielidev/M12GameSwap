<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import type { Reservation } from '@/interfaces/Reservation';
import PostRow from '@/components/PostRow.vue';
const apiEndpoint = import.meta.env.VITE_API_ENDPOINT;
const { token, userIsLoggedIn } = storeToRefs(useAuthStore());

const reservations = ref<Reservation[]>([]);

async function getReservedProducts() {

    try {
        const response: Response = await fetch(`${apiEndpoint}/posts/reservations`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token.value}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const reservationsData: { reservationsData: Reservation[] } = await response.json();
        reservations.value = reservationsData.reservationsData;

    } catch (error) {
        console.error(error);
    }
}

onMounted(() => {
    getReservedProducts();
})

const dropReservation = async (reservation: Reservation) => {
    reservations.value.splice(reservations.value.findIndex(res => res.reservation_id === reservation.reservation_id), 1);
    try {
        const response = await fetch(`${apiEndpoint}/posts/reservation/${reservation.reservation_id}`, {
            method: 'DELETE',
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token.value}`
            }
        });

        if (!response.ok) {
            return;
        }

    } catch (err) {
        console.log(err);
    }
};

</script>
<template>
    <section v-if="reservations.length > 0" class="w-75">
        <template v-for="reservation in reservations" :key="reservation.reservation_id">
            <PostRow @deleteReservation="dropReservation(reservation)" :post="reservation?.post"
                :purchaseDate="new Date(reservation?.reservation_created_at)" :purchased="false" :selled="false"
                :reserved="true">
            </PostRow>
        </template>
    </section>
    <section v-else>
        No has realizado la reserva de ningún producto todavía
    </section>
</template>

<style scoped></style>