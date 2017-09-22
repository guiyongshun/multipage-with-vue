new Vue({
    el: '.container',
    data: {
        addressList: [],
        limitNum: 3,
        currentIndex: 0,
        shippingMethod: 0,
        // currentAddress: {},
        delShow: false,
        editShow: false,
        editInfo: {
            userName: '',
            streetName: '',
            tel: ''
        }
    },
    computed: {
        filterAddress() {
            return this.addressList.slice(0,this.limitNum);
        },
        showOverlay(){
            return this.delShow || this.editShow;
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.getAddressList();
        })
    },
    methods: {
        getAddressList() {
            axios.get('data/address.json').then(res => {
                ({result: this.addressList} = res.data);
            })
        },
        showMore() {
            this.limitNum = this.addressList.length;
        },
        setDefault(index) {
            this.addressList.forEach((item,num)=> {
                item.isDefault = index == num;
            })
        },
        showDialog(type) {
            // this.currentAddress = item;
            switch (type){
                case 'del':
                    this.delShow = true;
                    break;
                case 'edit':
                    let currentAddress = this.addressList[this.currentIndex];

                    //todo 确保保存时才更新页卡中的地址信息，单独取一份数据进行编辑处理
                    this.editInfo = {
                        userName: currentAddress.userName,
                        streetName: currentAddress.streetName,
                        tel: currentAddress.tel
                    }

                    this.editShow = true;
                    break;
            }
        },
        delAddress() {
            let currentAddress = this.addressList[this.currentIndex];

            if(this.addressList.length > 1){
                //删除项为默认地址则重置为第一项
                if(currentAddress.isDefault){
                    this.addressList[0].isDefault = true;
                }
                //删除项为当前选中项则重置为第一项
                this.currentIndex = 0;
            }
            this.addressList.splice(this.currentIndex,1);
            this.delShow = false;
        },
        editAddress() {
            let currentAddress = this.addressList[this.currentIndex];

            Object.assign(currentAddress,this.editInfo);

            /*//todo 没找到批量更新data多个键值对的方法
            currentAddress.userName = this.editInfo.userName;
            currentAddress.streetName = this.editInfo.streetName;
            currentAddress.tel = this.editInfo.tel;*/

            this.editShow = false;
        }
    }
})