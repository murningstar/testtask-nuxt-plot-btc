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

/* 1. Setup interval controls */
/* 1.1 Anti FOUC (flash-of-unstyled-content) for naive-ui controls */
const controlsVisible = ref(false);
onMounted(() => {
    controlsVisible.value = true;
});
/* 1.2 Radio (interval controls) */
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
const intervalModel = ref("day");
/* 1.3 RangePicker (interval controls) */
const rangePickerVisible = computed(
    () => intervalModel.value === "customrange",
);
const rangeModel = ref<[number, number]>([
    getDateDayAgo().valueOf(),
    Date.now(),
]);

/* 2. Fetch and prepare data */
/* 2.1 Constuct params */
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
/* 2.2 Fetch using params (autorefetch on params update) */
const { data } = await useFetch("/api/btc", {
    params,
});
/* 2.3 remap to extract jsons */
const btcUpdates = computed(() => {
    return data.value!.map((btcUpdate) => btcUpdate.json);
});
/* 2.4 extract y-axis data */
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
/* 2.5 extract x-axis data */
const prices_X = computed(() => {
    // @ts-ignore
    return btcUpdates.value.map((btcUpdate) => btcUpdate.bpi.USD.rate_float);
});

/* 3. Setup chart */
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
/* 3.1 Prepare ChartOptions */
const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        decimation: { enabled: true, algorithm: "lttb" },
    },
};
/* 3.2 Compute ChartData */
const chartData = computed(() => {
    const res = reactive({
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

/* 4. Refresh chart (Line) on data update
    // Chart update is triggered only when :key is changed
    // :key accepts strings, so chartKostilToString is
    // computed of chartKostil
*/
const chartKostil = ref(0);
const chartKostilToString = computed(() => chartKostil.value.toString());
watch(
    chartData,
    () => {
        chartKostil.value++;
    },
    { deep: true },
);
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
                :key="chartKostilToString"
                :data="chartData"
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
