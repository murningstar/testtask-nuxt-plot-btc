<script setup lang="ts">
/* 2-37 Chart.js related code */
import { Line } from "vue-chartjs";
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineController,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
} from "chart.js";

/* Setup chart */
ChartJS.defaults.color = "white";
ChartJS.defaults.borderColor = "white";
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineController,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
);

/* Fetch and prepare data */
const response = await useFetch("/api/btc");
//@ts-ignore
const btcUpdates = response.data.value.map((btcUpdate) => btcUpdate.json);
const timestamps = reactive(
    btcUpdates.map((btcUpdate) => {
        //@ts-ignore
        const date = new Date(btcUpdate.time.updatedISO);
        return date.toISOString().split("T")[1].slice(0, 5);
    }).reverse(),
);
const prices = reactive(
    //@ts-ignore
    btcUpdates.map((btcUpdate) => btcUpdate.bpi.USD.rate_float),
);

/* Use fetched data in chart */
const chartData = ref({
    labels: timestamps,
    datasets: [
        {
            label: "Data One",
            backgroundColor: "#E6A328",
            data: prices,
        },
    ],
});
const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
});
</script>

<template>
    <div name="chart-wrapper" class="mx-[5%] flex h-full flex-col pb-5">
        <figure
            name="chart-container"
            class="effects relative grow bg-black px-[10%] py-[5%]"
        >
            <Line :data="chartData" :options="chartOptions" />
        </figure>
        <figcaption class="text-center">
            ⬆️График биточка (⬅️пояснение)
        </figcaption>
    </div>
</template>

<style scoped>
.effects {
    box-shadow: 0 0 100px -10px rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.332);
}
</style>
