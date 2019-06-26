<template>
    <div class="tbbox">
        <table class="table">
            
          <tr v-for="(val,index) in table[0]" :key="index" >
                <td v-for="(item, i) in val" :key="i" :colspan="item.cos" :rowspan="item.row">{{item.value}}</td>
          </tr>
        </table>

    </div>

</template>

<script>
  export default {
    name: 'edit',
    data () {
      return {
        table:[null]

        
      }
    },
    methods: {

    }
  }
</script>


<style scoped>
    table,table tr th, table tr td { border:1px solid #000000; }
    td {
    min-width: 20px;
    text-align: center;
    font-size:0.8rem; 
    padding: 5px 5px;
    
    }

    table {
    width: 100%;
    height: 100%;
    font-size: 0.9rem;
    /* border:1px solid red; */
    }

    .tbbox{
    max-width: 100%;
    max-height: 100%;
    }
</style>
