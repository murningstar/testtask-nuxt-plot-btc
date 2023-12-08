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
import {
    getDateDayAgo,
    getDateWeekAgo,
    getDateMonthAgo,
    getDateYearAgo,
} from "~/utils/dateUtils";

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
const intervalModel = ref("day");
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
const { data } = await useLazyFetch("/api/btc", {
    query: params,
});
//@ts-ignore
const btcUpdates = ref(data.value.map((btcUpdate) => btcUpdate.json));

const timestamps_Y = computed(() => {
    return btcUpdates.value.map((btcUpdate) => {
        //@ts-ignore
        const date = new Date(btcUpdate.time.updatedISO);

        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    });
});

const prices_X = computed(() => {
    //@ts-ignore
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
const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
});

/* async function refetch(newIntervalModel: string) {
    const response = await useFetch("/api/btc", {
        params: params.value,
    });
    //@ts-ignore
    btcUpdates.value = data.value.map((btcUpdate) => btcUpdate.json);
} */
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
                        :checked="option.value == intervalModel"
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
