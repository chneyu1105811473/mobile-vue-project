<template>
    <empty-page>
        <template slot="tip">
            <h3>Oops, page not found.</h3>
        </template>
    </empty-page>
</template>

<script>
import EmptyPage from '@/components/EmptyPage'
export default{
  name: 'Page404',
  components: {EmptyPage}
}
</script>
