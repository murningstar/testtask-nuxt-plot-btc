<script setup lang="ts">
import { NSpace, NRadioGroup, NRadioButton, NDatePicker } from "naive-ui";
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
    type ChartOptions,
} from "chart.js";
import { getDateDayAgo } from "../utils/dateUtils";

/* Setup interval controls */
/* 1) Radio (interval controls) */
const options = [
    {
        label: "Day",
        value: "Day",
    },
    {
        label: "Week",
        value: "Week",
    },
    {
        label: "Month",
        value: "Month",
    },
    {
        label: "Year",
        value: "Year",
    },
    {
        label: "Custom range",
        value: "customrange",
    },
].map((s) => {
    s.value = s.value.split(" ").join("").toLowerCase();
    return s;
});
const intervalModel = ref("month");
/* 2) RangePicker (interval controls) */
const rangePickerVisible = computed(
    () => intervalModel.value === "customrange",
);
const rangeModel = ref<[number, number]>([
    getDateDayAgo().valueOf(),
    Date.now(),
]);

/* Setup chart */
ChartJS.defaults.color = "#C7C7C7";
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
const params = computed(() => {
    if (intervalModel.value !== "customrange") {
        return { interval: intervalModel.value };
    } else {
        return {
            interval: "customrange",
            lowerLimit: rangeModel.value[0],
            upperLimit: rangeModel.value[1],
        };
    }
});
const { data, refresh } = await useFetch("/api/btc", {
    params,
    // watch: [intervalModel, rangeModel],
    /* key:
        "/api/btc?interval=" +
        (intervalModel.value == "customrange"
            ? "customrange" +
              "&" +
              "lowerLimit=" +
              rangeModel.value[0] +
              "&" +
              "upperLimit=" +
              rangeModel.value[1] // Ключ для range (состоит из customrange+lowerlimit+upperlimit)
            : intervalModel.value), */
});

/* watch(
    [intervalModel, rangeModel],
    () => {
        refresh();
    },
    { deep: true },
); */

const btcUpdates = computed(() => {
    return data.value!.map((btcUpdate) => btcUpdate.json);
});

const timestamps_Y = computed(() => {
    return btcUpdates.value.map((btcUpdate) => {
        // @ts-ignore
        const date = new Date(btcUpdate.time.updatedISO);

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    });
});

const prices_X = computed(() => {
    // @ts-ignore
    return btcUpdates.value.map((btcUpdate) => btcUpdate.bpi.USD.rate_float);
});

/* Use fetched data in chart */
const chartData = ref({
    labels: timestamps_Y,
    datasets: [
        {
            label: "BTC/USD",
            backgroundColor: "#1ABA6A",
            data: prices_X,
        },
    ],
});
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        decimation: { enabled: true, algorithm: "lttb" },
    },
};

const chartData2 = computed(() => {
    const res = ref({
        labels: timestamps_Y,
        datasets: [
            {
                label: "BTC/USD",
                backgroundColor: "#1ABA6A",
                data: prices_X,
            },
        ],
    });
    return res;
});
/* Anti FOUC for naive-ui controls */
const controlsVisible = ref(false);
onMounted(() => {
    controlsVisible.value = true;
});
</script>

<template>
    <div
        name="chart-wrapper"
        class="relative mx-[5%] flex h-full flex-col pb-5"
    >
        <h2 class="z-10 text-red-500">{{ data?.length }}</h2>
        <!-- Chart -->
        <figure
            name="chart-container"
            class="effects relative grow bg-black px-[10%] py-[5%]"
        >
            <Line
                :data="chartData2.value"
                :options="{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        decimation: { enabled: true, algorithm: 'lttb' },
                    },
                }"
            />
        </figure>
        <figcaption class="text-center">
            ⬆️График биточка (⬅️пояснение)
        </figcaption>
        <!-- Controls -->
        <div
            name="controls-container"
            v-if="controlsVisible"
            class="absolute left-0 top-0"
        >
            <NSpace vertical>
                <NRadioGroup
                    v-model:value="intervalModel"
                    name="radiobuttongroup1"
                    size="small"
                >
                    <NRadioButton
                        v-for="option in options"
                        :key="option.value"
                        :value="option.value"
                        :label="option.label"
                        :checked="option.value == intervalModel"
                    />
                </NRadioGroup>
                <NDatePicker
                    v-if="rangePickerVisible"
                    v-model:value="rangeModel"
                    type="daterange"
                    clearable
                />
            </NSpace>
        </div>
    </div>
</template>

<style scoped>
.effects {
    box-shadow: 0 0 100px -10px rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.332);
}
</style>
