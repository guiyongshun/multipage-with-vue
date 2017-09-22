new Vue({
    el: '#app',
    data: {
        productList: [],
        totalMoney: 0,
        isCheckAll: false,
        delFlag: false,
        currentProduct: null
    },
    filters: {
        formatMoney(value,type){
            return '￥ ' + value.toFixed(2) + ' ' + type;
        }
    },
    watch: {

    },
    computed: {
        totalPrice() {//通过计算属性绑定后可以实时监听商品数量及单价的改变计算总价，无需在其他操作地方再次调用计算总价方法
            let totalPrice = 0;

            this.productList.forEach(item => {
                if(item.checked){
                    totalPrice += item.productQuantity * item.productPrice;
                }
            })
            return totalPrice;
        },
        getCheckAllFlag() {//单选时判断是否已背全选，方便同步全选状态
            if(this.productList.length == 0) return false;

            return this.isCheckAll = this.productList.every(value => {
                return value.checked;
            })
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.cartView();
        })
    },
    methods: {
        cartView() {
            axios.get('data/cartData.json').then(res => {
                ({list: this.productList,totalMoney: this.totalMoney} = res.data.result);
            })
        },
        changeMoney(product,isAdd){
            if(isAdd){
                product.productQuantity++;
            }else{
                if(product.productQuantity<=1) return;
                product.productQuantity--;
            }
        },
        selectProduct(item) {
            if(typeof item.checked == 'undefined'){
                this.$set(item,'checked',true);
            }else{
                item.checked = !item.checked;
            }

            this.isCheckAll = this.getCheckAllFlag;
        },
        selectAllProducts(isSelect) {
            if(this.productList.length == 0) return;

            this.isCheckAll = typeof isSelect == 'boolean' ? isSelect : !this.isCheckAll;
            this.productList.forEach(item => {
                if(typeof item.checked == 'undefined'){
                    this.$set(item,'checked',this.isCheckAll);
                }else{
                    item.checked = this.isCheckAll;
                }
            })
        },
        delconfim(item) {
            this.delFlag = true;
            this.currentProduct = item;
        },
        deleteProduct() {
            let index = this.productList.indexOf(this.currentProduct);

            this.productList.splice(index,1);
            this.delFlag = false;
            this.isCheckAll = this.getCheckAllFlag;
        }
    }
})