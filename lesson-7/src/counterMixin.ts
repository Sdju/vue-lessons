
export const counterMixin = {
    props: {
        modelValue: {
            type: Number,
            required: true,
        },
    },

    methods: {
        decrement() {
            this.$emit('update:modelValue', this.modelValue - this.step)
        }
    },

    emits: ['update:modelValue'],

    expose: ['decrement'],
}