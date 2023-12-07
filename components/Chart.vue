<script setup lang="ts">
import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from "chart.js";
import { Bar, Chart } from "vue-chartjs";
ChartJS.defaults.color = "white";
ChartJS.defaults.borderColor = "white";
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
);

// #E69E20
const chartData = ref({
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
        {
            label: "Data One",
            backgroundColor: "#E6A328",
            data: [40, 20, 12, 50, 10],
        },
    ],
});
const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
});
</script>

<template>
    <div name="chart-wrapper" class="mx-[5%] flex flex-col">
        <div
            name="chart-container"
            class="relative grow bg-black px-[10%] py-[5%]"
        >
            <Bar :data="chartData" :options="chartOptions" />
        </div>
        <h1 class="text-center">(График биточка (пояснение))</h1>
    </div>
</template>

<style scoped></style>
