<template lang="pug">
v-list
  v-list-item(
    two-line
    v-for="item in items",
    :key="item.id",
    @click="$emit('selected',item)"
    )
    v-avatar.ma-3(size="45" color="primary")
      v-img(:src="item.picture")
    |
    v-list-item-content
      v-list-item-title  {{ item.name }}
        v-btn.mx-2(icon x-small )
          v-icon fas fa-info-circle
      v-list-item-subtitle  {{ item.description }}
      v-divider
</template>
<script>
// import ProfileViewModal from '@/components/usersprofile/ProfileViewModal'
export default {
  props: ['items']
}
</script>
