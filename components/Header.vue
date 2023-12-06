<template>
    <header>
        <h1>{{ title }}</h1>
    </header>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: 'Header',
        },
    },
};
</script>
<style>
header {
    background: #409EFF;
    padding: 8px 16px;
    color: white;
}
</style>