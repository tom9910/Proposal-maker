<script lang="ts">
    export let icon: string
    let className: string | undefined = undefined
    export {className as class}
</script>

<div class={`flex items-center justify-center h-full w-full ${className}`}>
    <svg class="w-6 h-6 fill-current">
        <path d={icon} />    
    </svg>
</div>