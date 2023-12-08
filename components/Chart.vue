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
} from "chart.js";

/* Setup interval controls */
/* 1) Radio (interval controls) */
const intervalModel = ref("day");

const options = [
    {
        value: "Day",
        label: "day",
    },
    {
        value: "Week",
        label: "week",
    },
    {
        value: "Month",
        label: "month",
    },
    {
        value: "Year",
        label: "year",
    },
    {
        value: "Custom range",
        label: "customrange",
    },
].map((s) => {
    s.value = s.value.toLowerCase();
    return s;
});
/* 2) RangePicker (interval controls) */
const rangePickerVisible = computed(() => intervalModel.value === "custom");
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
    if (intervalModel.value! == "customrange") {
        return { interval: intervalModel.value };
    } else {
        return {
            interval: "customrage",
            lowerLimit: rangeModel.value[0],
            upperLimit: rangeModel.value[1],
        };
    }
});
const response = await useFetch("/api/btc", {
    params: params.value
});
//@ts-ignore
const btcUpdates = response.data.value.map((btcUpdate) => btcUpdate.json);
const timestamps_Y = reactive(
    btcUpdates
        .map((btcUpdate) => {
            //@ts-ignore
            const date = new Date(btcUpdate.time.updatedISO);
            return date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            });
        })
        .reverse(),
);
const prices_X = reactive(
    //@ts-ignore
    btcUpdates.map((btcUpdate) => btcUpdate.bpi.USD.rate_float),
);
/* const timestamps_Y = computed(() => {

}) */

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
const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
});
</script>

<template>
    <div
        name="chart-wrapper"
        class="relative mx-[5%] flex h-full flex-col pb-5"
    >
        <!-- Chart -->
        <figure
            name="chart-container"
            class="effects relative grow bg-black px-[10%] py-[5%]"
        >
            <Line :data="chartData" :options="chartOptions" />
        </figure>
        <figcaption class="text-center">
            ⬆️График биточка (⬅️пояснение)
        </figcaption>
        <!-- Controls -->
        <div name="controls-container" class="absolute left-0 top-0">
            <n-space vertical>
                <n-radio-group
                    v-model:value="intervalModel"
                    name="radiobuttongroup1"
                    size="small"
                >
                    <n-radio-button
                        v-for="option in options"
                        :key="option.value"
                        :value="option.value"
                        :label="option.label"
                    />
                </n-radio-group>
                <n-date-picker
                    v-if="rangePickerVisible"
                    v-model:value="rangeModel"
                    type="daterange"
                    clearable
                />
            </n-space>
        </div>
    </div>
</template>

<style scoped>
.effects {
    box-shadow: 0 0 100px -10px rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.332);
}
</style>
