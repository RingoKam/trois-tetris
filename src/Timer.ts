import { ref } from 'vue'

const setupTimer = () => {
    const runningTimer = ref(0);
    const duration = ref(350);
    let lastTime: number | null = null

    const isTimeUp = (timeNow: number) => {
        const delta = lastTime === null ? 0 : timeNow - lastTime
        lastTime = timeNow
        if(runningTimer.value > 0) {
            runningTimer.value -= delta
            return false
        } else {
            //gradually increase drop speed
            duration.value -= 0.5
            runningTimer.value = duration.value;
            return true
        }
    }

    return {
        duration,
        isTimeUp
    }
}

export {
    setupTimer
}