<script setup>
import { computed, nextTick, reactive, ref, watch } from 'vue';
import { timeSlots } from '../data/restaurant';

const props = defineProps({ open: Boolean });
const emit = defineEmits(['close']);
const nameInput = ref(null);
const submitted = ref(false);
const errors = reactive({ name: '', phone: '', date: '', time: '', guests: '' });
const form = reactive({ name: '', phone: '', date: '', time: '', guests: '2' });

const today = computed(() => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 10);
});
const bookingSummary = computed(() => `${form.date} · ${form.time} · ${form.guests} 位`);

function resetForm() {
  Object.assign(form, { name: '', phone: '', date: '', time: '', guests: '2' });
  Object.keys(errors).forEach((key) => { errors[key] = ''; });
  submitted.value = false;
}

function closeDialog() { emit('close'); }

function validate() {
  errors.name = form.name.trim() ? '' : '请填写姓名';
  errors.phone = /^1[3-9]\d{9}$/.test(form.phone) ? '' : '请输入正确的 11 位手机号';
  errors.date = form.date && form.date >= today.value ? '' : '请选择今天或之后的日期';
  errors.time = form.time ? '' : '请选择到店时段';
  errors.guests = form.guests ? '' : '请选择用餐人数';
  return !Object.values(errors).some(Boolean);
}

function submitBooking() {
  if (validate()) submitted.value = true;
}

watch(() => props.open, async (isOpen) => {
  if (!isOpen) return;
  resetForm();
  await nextTick();
  nameInput.value?.focus();
});
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="dialog-backdrop" role="presentation" @click.self="closeDialog">
      <section class="booking-dialog" role="dialog" aria-modal="true" aria-labelledby="booking-title" @keydown.esc="closeDialog">
        <button class="close-dialog" type="button" aria-label="关闭预约窗口" @click="closeDialog">×</button>
        <template v-if="!submitted">
          <p class="eyebrow"><span></span> RESERVATION</p>
          <h2 id="booking-title">预订一席好味</h2>
          <p class="booking-intro">填写信息后，我们会为您预留用餐时段。</p>
          <form id="booking-form" novalidate @submit.prevent="submitBooking">
            <label>姓名<input ref="nameInput" v-model.trim="form.name" name="name" autocomplete="name" placeholder="怎么称呼您" :aria-invalid="Boolean(errors.name)" @input="errors.name = ''" /><small v-if="errors.name">{{ errors.name }}</small></label>
            <label>手机<input v-model.trim="form.phone" name="phone" inputmode="numeric" maxlength="11" autocomplete="tel" placeholder="用于确认预约" :aria-invalid="Boolean(errors.phone)" @input="errors.phone = ''" /><small v-if="errors.phone">{{ errors.phone }}</small></label>
            <div class="form-row">
              <label>日期<input v-model="form.date" name="date" type="date" :min="today" :aria-invalid="Boolean(errors.date)" @change="errors.date = ''" /><small v-if="errors.date">{{ errors.date }}</small></label>
              <label>人数<select v-model="form.guests" name="guests" :aria-invalid="Boolean(errors.guests)" @change="errors.guests = ''"><option v-for="number in [1, 2, 3, 4, 5, 6]" :key="number" :value="String(number)">{{ number }} 位</option><option value="7+">7 位及以上</option></select><small v-if="errors.guests">{{ errors.guests }}</small></label>
            </div>
            <label>到店时段<select v-model="form.time" name="time" :aria-invalid="Boolean(errors.time)" @change="errors.time = ''"><option value="" disabled>选择到店时间</option><optgroup v-for="slot in timeSlots" :key="slot.group" :label="slot.group"><option v-for="time in slot.values" :key="time" :value="time">{{ time }}</option></optgroup></select><small v-if="errors.time">{{ errors.time }}</small></label>
            <button class="primary-button" type="submit">提交预约 <span>→</span></button>
          </form>
        </template>
        <div v-else class="booking-success" role="status">
          <p class="eyebrow"><span></span> REQUEST RECEIVED</p>
          <h2>期待与您见面</h2>
          <p><b>{{ form.name }}</b>，已为您记录预约意向。</p>
          <p class="booking-summary">{{ bookingSummary }}</p>
          <p class="booking-note">我们会尽快通过 {{ form.phone }} 与您确认座位。</p>
          <button class="primary-button" type="button" @click="closeDialog">完成 <span>→</span></button>
        </div>
      </section>
    </div>
  </Teleport>
</template>
