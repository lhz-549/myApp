import React, {useEffect, useState} from 'react';
import {View, Picker, Input, Textarea, Text} from '@tarojs/components';
import './sub.scss';
import dayjs from 'dayjs';
import {AtButton, AtList, AtListItem} from "taro-ui";
import Taro, {useRouter} from "@tarojs/taro";
import "taro-ui/dist/style/components/list.scss";
import "taro-ui/dist/style/components/button.scss";
import request from "../../utils/request";
import {userInfo} from "os";


const WateringForm = () => {
  const router = useRouter();
  const { plantid } = router.params;

  const [date, setDate] = useState('');
  const [timePeriod, setTimePeriod] = useState('');
  const [amount, setAmount] = useState('');

  const [opcate,setOpcate]=useState("");
  const opcates = ['浇水', '施肥', '修剪', '收获'];

  // const timePeriods = ['早晨', '上午', '中午', '下午', '傍晚'];
  const timePeriods = [
    { label: '早晨 7:00-9:00', start: '07:00', end: '09:00' },
    { label: '上午 9:00-12:00', start: '09:00', end: '12:00' },
    { label: '中午 12:00-14:00', start: '12:00', end: '14:00' },
    { label: '下午 14:00-18:00', start: '14:00', end: '18:00' },
    { label: '傍晚 18:00-20:00', start: '18:00', end: '20:00' }
  ];
  const [availableTimePeriods, setAvailableTimePeriods] = useState(timePeriods);

  const currentHour = dayjs().hour();
  const currentMinute = dayjs().minute();

  // 将时间转换为分钟数
  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const currentTimeInMinutes = currentHour * 60 + currentMinute;


  const handleDateChange = (e) => {
    //setDate(e.detail.value);
    const selectedDate = e.detail.value;
    setDate(selectedDate);

    if (selectedDate === dayjs().format('YYYY-MM-DD')) {

      const filteredTimePeriods = timePeriods.filter(({ start, end }) =>
        timeToMinutes(start) > currentTimeInMinutes || (timeToMinutes(start) < currentTimeInMinutes && timeToMinutes(end) - 30 > currentTimeInMinutes)
      );
      setAvailableTimePeriods(filteredTimePeriods);
    } else {
      setAvailableTimePeriods(timePeriods);
    }
  };

  const handleTimePeriodChange = (e) => {
    setTimePeriod(availableTimePeriods[e.detail.value].label);
    // setTimePeriod(timePeriodsWithDisabled[e.detail.value].label);
  };

  const handleAmountChange = (e) => {
    if(adoptnum2[0].usedNum>=e.detail.value){
      setAmount(e.detail.value);
    }else {
      Taro.showToast({
        title: '超出可使用的最大值',
        icon: 'none',
      });
      setAmount("");
    }
    console.log(adoptnum2[0].usedNum);
    console.log(e.detail.value);
  };

  const handleOPChange = (e) => {
    setOpcate(opcates[e.detail.value]);
  };

  //const userInfo = Taro.getStorageSync('userInfo');

  const handleSubmit = () => {
    if (date && timePeriod && amount && opcate) {
      // 提交表单数据
      //console.log({ opcate, date, timePeriod, amount });
      request({
        url: `/subscribe/addsubscribeinfobyplant`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          // 'token': `Bearer ${Taro.getStorageSync('token')}`, // 如果需要 token，可以解注释
        },
        data: {
          plantId: plantid,
          subCate: opcate,
          subDate: date,
          subTime: timePeriod,
          subAdopt: amount,
          subRemarks: textareaValue,
        },
      }).then(res=>{
        if (res.message === "success") {
          Taro.showToast({
            title: '已提交您的预约！',
            icon: 'success'
          });
          setTimeout(() => {
            Taro.navigateBack();
          }, 2000);
        }
      }).catch(err => {
          Taro.showToast({
            title: '网络请求失败: ' + err.message,
            icon: 'none',
          });
        });
    } else {
      Taro.showToast({
        title: '请填写完所有信息后再重新提交！',
        icon: 'none'
      });
    }
  };
  const handleReset=()=> {
    setDate('');
    setTimePeriod('');
    setAmount('');
    setOpcate('');
    setTextareaValue('');
    // setAvailableTimePeriods(timePeriods); // 重置时间段
  }

  const [textareaValue, setTextareaValue] = useState('');
  const handleTextareaChange = (e) => {
    setTextareaValue(e.target.value);
  };

  const maxLength = 200;

  const opcateIndex = opcates.indexOf(opcate);
  const placeholders = [
    '请先选择处理类型',
    '请输入浇水量(L)',
    '请输入肥料量(kg|千克)',
    '请输入修剪程度(1次)',
    '请输入收取的数目(个)'
  ];
  const placeholder = opcateIndex !== -1 ? placeholders[opcateIndex + 1] : placeholders[0];

  const adoptrgservice = (index)=>{
    const productIdMap = {
      1: "5",
      2: "4",
      3: "6",
      4: "7",
    };

    const mappedProductId = productIdMap[index];
    const filteredItems = adoptnum.filter(item => item.productId === mappedProductId);
    console.log(filteredItems);
    setAdoptnum2(filteredItems);
  };

  const [adoptnum, setAdoptnum] = useState([]);
  const [adoptnum2, setAdoptnum2] = useState([]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const userInfo = Taro.getStorageSync('userInfo');
  useEffect(()=>{
    if(userInfo) {
      request({
        url: `/orderitems/selUsedRGAdoptNum?userid=${userInfo.id}`,
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
          // 'token': `Bearer ${Taro.getStorageSync('token')}`, // 如果需要 token，可以解注释
        },
      }).then(res => {
        if (res.message === "success") {
          const proItems = res.data.map(item => ({
            productId: item.productId,
            usedNum: item.usedNum,
            specvalueName: item.specvalueName,
            pname:item.pname,
          }));
          setAdoptnum(proItems);
        }
      }).catch(err => {
        Taro.showToast({
          title: '网络请求失败: ' + err.message,
          icon: 'none',
        });
      });
    }

  },[])

  useEffect(() => {
    const opcateIndex1 = opcates.indexOf(opcate);
    if (opcateIndex1 !== -1) {
      adoptrgservice(opcateIndex1 + 1); // opcateIndex + 1 对应 productIdMap 的值
    }
  }, [opcate, adoptnum]);

  // @ts-ignore
  return (
    <View className="outside">
      <View className="titletop">
        <Text>YG——人工预约养护单</Text>
      </View>
      <View className="totalout">
        <View className="yuyuebj">
          <Picker mode="selector" range={opcates} onChange={handleOPChange}>
            <AtList>
              <AtListItem
                title='选择类型'
                extraText={opcate || '选择处理类型'}
              />
            </AtList>
          </Picker>
        </View>
        <View className="yuyuebj">
          <Picker mode="date"
                  onChange={handleDateChange}
                  start={dayjs().format('YYYY-MM-DD')}>
            <AtList>
              <AtListItem
                title='选择日期'
                extraText={date || '选择日期'}
              />
            </AtList>
          </Picker>
        </View>
        <View className="yuyuebj">
          <Picker mode="selector"
                  range={availableTimePeriods.map(({ label }) => label)}
                  onChange={handleTimePeriodChange}
          >
            <AtList>
              <AtListItem
                title='选择时间段'
                extraText={timePeriod || '选择时间段'}
              />
            </AtList>
          </Picker>
        </View>
      </View>
      {/*<View className={`inputout opcate-${opcateIndex}`}>*/}
      {/*  <Picker*/}
      {/*    mode="selector"*/}
      {/*    range={adoptnum2.map(({ usedNum, specvalueName }) => `${usedNum} (${specvalueName})`)}*/}
      {/*    onChange={handleAmountChange}*/}
      {/*  >*/}
      {/*    <View className="picker-bet">*/}
      {/*      <Text className="text-left">{placeholder}</Text>*/}
      {/*      <Text className="text-right">{amount || "请选择"}</Text>*/}
      {/*    </View>*/}
      {/*  </Picker>*/}
      {/*</View>*/}
      <View className={`inputout opcate-${opcates.indexOf(opcate)}`}>
        {opcates.indexOf(opcate) >= 0 && adoptnum2.length > 0 && (
          <Text className="rgadopt-text">{adoptnum2[0].pname} {'\u00A0'}{"可使用次数:"}{adoptnum2[0].usedNum} {'\u00A0'} {adoptnum2[0].specvalueName}</Text>
        )}
        <View className="picker-bet">
          <Text className="text-left">{placeholder}</Text>
          {opcates.indexOf(opcate) >= 0&&
            <Input
              type="number"
              placeholder={placeholder}
              value={amount}
              onInput={handleAmountChange}
              className="text-right"
            />
          }
        </View>
        {/*<Picker*/}
        {/*  mode="selector"*/}
        {/*  range={adoptnum2.map(({ usedNum, specvalueName }) => `${usedNum} (${specvalueName})`)}*/}
        {/*  onChange={handleAmountChange}*/}
        {/*>*/}
        {/*  <View className="picker-bet">*/}
        {/*    <Text className="text-left">{placeholder}</Text>*/}
        {/*    <Text className="text-right">{amount || "请选择"}</Text>*/}
        {/*  </View>*/}
        {/*</Picker>*/}
      </View>

      <View className="richtext">
        <Textarea
          value={textareaValue}
          onInput={handleTextareaChange}
          maxlength={maxLength}
          placeholder='请输入您的备注(可不写)'
        />
        <View className="char-count">
          {textareaValue.length}/{maxLength}
        </View>
      </View>
      <View className="butsubrest">
        <AtButton className="yuyuebut" type='primary' size='small' onClick={handleSubmit}>提交</AtButton>
        <AtButton className="yuyuebut" type='primary' size='small' onClick={handleReset}>重置</AtButton>
      </View>
    </View>
  );
};

export default WateringForm;
