import Taro from '@tarojs/taro';
import { View, Image, Text, Button } from '@tarojs/components';
import './index.scss';
import {AtButton, AtDrawer} from "taro-ui";
import React, {useCallback, useEffect, useState} from "react";
import "taro-ui/dist/style/components/drawer.scss";
import "taro-ui/dist/style/components/list.scss";
import request from "../../utils/request";


// 生成能量球的位置函数，确保位置不重叠
let ballsSum=0;
const maxBalls = 10;
const proballsnps=1;


const generateEnergyBalls = (numElements, existingPositions = [], maxBalls) => {
  // 定义一个空数组，用于存储新生成的能量球
  const elements = [];

  // 定义一个函数，用于生成随机位置
  const getRandomPosition = () => {

    // 生成一个随机的顶部位置，范围在0到200像素之间
    const randomTop = Math.floor(Math.random() * 150) + 'rpx';
    // 生成一个随机的左侧位置，范围在50到250像素之间
    const randomLeft = Math.floor(Math.random() * 500+20) + 'rpx';
    // 返回包含顶部和左侧位置的对象
    return { top: randomTop, left: randomLeft };
  };
  // 循环生成指定数量的能量球，同时确保总数不超过maxBalls
  while (elements.length < numElements && existingPositions.length + elements.length < maxBalls) {
    let position;
    let attempts = 0;
    // 尝试生成一个不与现有能量球重叠的位置
    do {
      position = getRandomPosition();
      attempts++;
      if (attempts > 200) break; // 防止无限循环，尝试超过100次后退出
    } while (existingPositions.some(p => Math.abs(parseInt(p.top) - parseInt(position.top)) < 20 && Math.abs(parseInt(p.left) - parseInt(position.left)) < 20));
    // 将生成的能量球位置添加到elements数组
    if(attempts<=200){
      //ballsSum+=proballsnps;
      ballsSum=existingPositions.length>0?proballsnps+ballsSum:0;
      elements.push({ id: ballsSum, ...position, visible: true });
      // 将位置添加到existingPositions数组以确保不重叠
      //console.info("生成的ball_id:"+ballsSum+"_生成前能量球数目:"+existingPositions.length)
      existingPositions.push(position);
    }else{
      console.info("找不到可以生成能量球的合理位置")
    }

  }
  //console.info("能量球个数:"+(existingPositions.length));
  // 返回生成的能量球数组
  return elements;
};




export default function TreePage() {

  const [fruitInfoData,setFruitInfoData] = useState([
    {
      title: '果树介绍',
      description: '加种后可见详情'
    }, {
      title: '果树的种类',
      description: '加种后可见详情'
    }, {
      title: '果树的成长与寿命',
      description: '加种后可见详情'
    }, {
      title: '果树的日常养护',
      description: '加种后可见详情'
    }
  ]);


  const [energyBalls, setEnergyBalls] = useState([]);
  const [existingPositions, setExistingPositions] = useState([]);
  const [energy, setEnergy] = useState(0); // 初始化能量值


  useEffect(() => {
    const initialBalls = generateEnergyBalls(5,existingPositions,maxBalls);
    setEnergyBalls(initialBalls);
    setExistingPositions(initialBalls.map(ball => ({ top: ball.top, left: ball.left })));

    const interval = setInterval(() => {
      handleGenerateEnergyBalls();
    },
       1000 * 60 * 60
      // 1000*10
    ); // 1000 毫秒 * 60 秒 * 60 分钟 = 一小时

    // 组件卸载时清除定时器，避免内存泄漏
    return () => clearInterval(interval);
  }, []);

  const handleEnergyBallClick = (id) => {
    setEnergyBalls((prev) => {
      // 过滤掉被点击的能量球
      const updatedBalls = prev.filter((ball) => {
        if (ball.id === id) {
          //console.info("filter_ball_id:" + id);
          setExistingPositions(existingPositions.filter(p => !(p.top === ball.top && p.left === ball.left)));

          const newenergy = energy+1;
          request({
            url: `/plant/adoptgrowupvalue2?plantid=${treeid}&value=${newenergy}&valueps=1`,
            method: 'POST',
            header: {
              //'token': `Bearer ${Taro.getStorageSync('token')}`,
              'Content-Type': 'application/json',
            }
          }).then(res => {
            if (res.message === "success") {
              setEnergy(newenergy);
              //setEnergy((prevEnergy) => prevEnergy + 1); // 每次点击时增加能量值
            }else{
              Taro.showToast({
                title: '请联系管理员',
                icon: 'none',
              });
            }
          }).catch(err => {
            Taro.showToast({
              title: '登录请求失败: ' + err.message,
              icon: 'none',
            });
          });
          return false; // 过滤掉这个 ball
        }
        return true;
      });
      let filternum = updatedBalls.filter(ball => ball.visible);
      //console.info("点击后能量球个数: " + filternum.length);
      //console.log("treeid为:"+treeid+"energy为:"+newenergy);

      return updatedBalls;
    });
  };


  const handleGenerateEnergyBalls = () => {
    setEnergyBalls((prev) => {
      const newBalls = generateEnergyBalls(proballsnps, existingPositions, maxBalls);
      if (newBalls.length > 0) {
        //console.info("生成后的能量球个数: " + (existingPositions.length ));
        return [...prev, ...newBalls];
      }
      return prev;
    });
  };

  const [expanded, setExpanded] = useState(fruitInfoData.map(() => false));

  const toggleExpand = (index) => {
    setExpanded(prev => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  const [animation, setAnimation] = useState(null);
  // const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleWater = () => {
    setWaterDisabled(true); // 禁用按钮
    triggerAnimation('water');
    setWaterAnimationIndex(() => Math.floor(Math.random() * waterAnimations.length));
    setTimeout(() => {
      const newenergy = energy+5;
      setEnergy(newenergy);

      // console.log("treeid为:"+treeid+"energy为:"+newenergy);
      request({
        url: `/plant/adoptgrowupvalue2?plantid=${treeid}&value=${newenergy}&valueps=5`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
        }else{
          Taro.showToast({
            title: '请联系管理员',
            icon: 'none',
          });
        }
      }).catch(err => {
        Taro.showToast({
          title: '登录请求失败: ' + err.message,
          icon: 'none',
        });
      });
      setWaterDisabled(false);
    }, 3000);
    // /plant/adoptgrowupvalue
  };
  const handleFertilize = () => {
    setFertilizeDisabled(true);
    triggerAnimation('fertilize');
    setTimeout(() => {
      const newenergy = energy+10;
      setEnergy(newenergy);
      // setEnergy(prev => prev + 10);


      request({
        url: `/plant/adoptgrowupvalue2?plantid=${treeid}&value=${newenergy}&valueps=10`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
        }else{
          Taro.showToast({
            title: '请联系管理员',
            icon: 'none',
          });
        }
      }).catch(err => {
        Taro.showToast({
          title: '登录请求失败: ' + err.message,
          icon: 'none',
        });
      });
      setFertilizeDisabled(false);
    }, 3000);
  };
  const handlePrune = () => {
    setPruneDisabled(true);
    triggerAnimation('prune');
    setTimeout(() => {
      const newenergy = energy+6;
      setEnergy(newenergy);
      // setEnergy(prev => Math.max(prev + 6, 0));

      request({
        url: `/plant/adoptgrowupvalue2?plantid=${treeid}&value=${newenergy}&valueps=6`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success") {
        }else{
          Taro.showToast({
            title: '请联系管理员',
            icon: 'none',
          });
        }
      }).catch(err => {
        Taro.showToast({
          title: '登录请求失败: ' + err.message,
          icon: 'none',
        });
      });
      setPruneDisabled(false);
    }, 3000);
  };
  const handleHarvest = () => {
    if(energy>0){
      setHarvestDisabled(true);
      triggerAnimation('harvest');
      setTimeout(() => {
        Taro.showToast({
          title: `已达到${energy}点能量!`,
          icon: 'success'
        });
        // setEnergy(0);
        setHarvestDisabled(false);
      }, 3000);
    }else{
      Taro.showToast({
        title: `没有能量可取!`,
        icon: 'error'
      });
    }
  };
  const triggerAnimation = (type) => {
    setAnimation(type);
    setTimeout(() => setAnimation(null), 2900); // 动画持续3秒
  };

  const [waterAnimationIndex, setWaterAnimationIndex] = useState(0); // 新增状态变量
  const waterAnimations = [
    "https://i.111666.best/image/EoHcKgTGScm23SmxL4cmGF.png",
    "https://i.111666.best/image/5azL7Cx2n5h5aC5eiFTCRe.png"
  ];

  const [show,setShow ]= useState(false);

  const openDrawer = () => {
    setShow(!show);
  };

  const closeDrawer = () => {
    setShow(!show);
  };

  const [plantTreeimg,setPlantTreeimg]=useState("");
  const [plantlist,setPlantlist]=useState([
  ]);
  const [planttree,setPlanttree]=useState([
  ])
  const userInfo = Taro.getStorageSync('userInfo');

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleDateString('zh-CN'); // 使用中文格式的日期，例如2024-06-18
  };

  useEffect(() => {
    fetchplant();
    Taro.eventCenter.on('login', fetchplant);
    Taro.eventCenter.on('plantUpdated', fetchplant);
    Taro.eventCenter.on('logout', setNull);

    return () => {
      Taro.eventCenter.on('login', fetchplant);
      Taro.eventCenter.off('plantUpdated', fetchplant);
      Taro.eventCenter.on('logout', setNull);
    };
    }, []);

  const setNull = () => {
    console.log("执行了setnull方法");
    setPlanttree([]);
    setPlantlist([]);
    setTreeid(0);
    setPlantTreeimg("");
    setEnergy(0);
    const newFruitInfoData = [
      {
        title: '果树介绍',
        description: ""
      },
      {
        title: '果树的种类',
        description: ""
      },
      {
        title: '果树的成长与寿命',
        description: ""
      },
      {
        title: '果树的日常养护',
        description: ""
      }
    ];
    setFruitInfoData(newFruitInfoData);
  }

  const fetchplant=()=>{
    const userid = Taro.getStorageSync('userInfo').id;
    console.log("执行了plant初始化方法");
    if(userid){
      request({
        url: `/plant/allplantinfobyuserid?userid=${userid}`,
        method: 'POST',
        header: {
          //'token': `Bearer ${Taro.getStorageSync('token')}`,
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.message === "success" && res.data!==null && res.data.length > 0) {
          const proItems = res.data.map(item => ({
            id: item.id,
            productId: item.productId,
            growupValue: item.growupValue,
            createTime: formatTime(item.createTim),
            updateTime: formatTime(item.updateTime),
            growupandlife: item.growupandlife,
            dailymaintenance: item.dailymaintenance,
            categoryName: item.categoryName,
            categoryDescription: item.categoryDescription,
            pdescription: item.pdescription,
            pimage:item.pimage,
            pname:item.pname
          }));
          //console.log(proItems);
          const newPlantList = proItems.map(item => item.pname+item.id);
          setPlanttree(proItems);
          setPlantlist(newPlantList);

          // 这里可以根据需要执行其他操作，比如导航到详情页或者更新状态
          const planttreeElement = proItems[0];
          setTreeid(planttreeElement.id);
          setPlantTreeimg(planttreeElement.pimage);
          setEnergy(planttreeElement.growupValue);
          const newFruitInfoData = [
            {
              title: '果树介绍',
              description: planttreeElement.pname+", "+planttreeElement.pdescription
            },
            {
              title: '果树的种类',
              description: planttreeElement.categoryName+", "+planttreeElement.categoryDescription
            },
            {
              title: '果树的成长与寿命',
              description: planttreeElement.growupandlife
            },
            {
              title: '果树的日常养护',
              description: planttreeElement.dailymaintenance
            }
          ];
          setFruitInfoData(newFruitInfoData);
        }
      });
    }
  }

  const [treeid,setTreeid]=useState(0);

  const handleItemClick = (index) => {
    //console.log('Item clicked:', planttree[index]);
    const planttreeElement = planttree[index];
    // 这里可以根据需要执行其他操作，比如导航到详情页或者更新状态
    setPlantTreeimg(planttreeElement.pimage);
    setEnergy(planttreeElement.growupValue);
    setTreeid(planttreeElement.id);
    const newFruitInfoData = [
      {
        title: '果树介绍',
        description: planttreeElement.pname+", "+planttreeElement.pdescription
      },
      {
        title: '果树的种类',
        description: planttreeElement.categoryName+", "+planttreeElement.categoryDescription
      },
      {
        title: '果树的成长与寿命',
        description: planttreeElement.growupandlife
      },
      {
        title: '果树的日常养护',
        description: planttreeElement.dailymaintenance
      }
    ];
    setFruitInfoData(newFruitInfoData);
  };

  const [waterDisabled, setWaterDisabled] = useState(false);
  const [fertilizeDisabled, setFertilizeDisabled] = useState(false);
  const [pruneDisabled, setPruneDisabled] = useState(false);
  const [harvestDisabled, setHarvestDisabled] = useState(false);

  //可选择的种植列表
  const addplant=()=>{
    if(userInfo){
      Taro.navigateTo({
        url: '/pages/plantadd/plantadd',
      });
    }else if(!userInfo){
      Taro.showToast({
        title: '请先登录账号',
        icon: 'none',
      });
    }
  };

  return (
    <View className="container">

      {/*{planttree.length>0 &&*/}
      {/*  <View>*/}

          <AtDrawer
            show={show}
            mask
            // width="150px"
            onClose={closeDrawer}
            items={plantlist}
            onItemClick={handleItemClick}
          ></AtDrawer>
          <View className="top-part">
            <View className="header">
              <View className="nav-icons">
                <Text className="icon" onClick={openDrawer}>&#x1F333;<Text className="myplant">我的种植</Text></Text> {/* 树图标 */}
                <View className="right-icons">
                  {/*<Text className="icon" style={{ marginRight: '10rpx' }}>&#x2764;</Text> /!* 收藏图标 *!/*/}
                  <Text className="myplant" onClick={addplant}>
                    {/*&#x2B50;*/}
                    加种
                  </Text> {/* 星形图标 */}
                  <Text className="icon">&#x1F4E4;</Text> {/* 分享图标 */}
                </View>
              </View>
            </View>
            <View className="tree-card">
              {planttree.length>0 && energyBalls.map((ball) =>
                  ball.visible && (
                    <Image
                      key={ball.id}
                      className="ele-image"
                      src={require("../../assets/effect/ball.png")}
                      style={{ top: ball.top, left: ball.left }}
                      onClick={() => handleEnergyBallClick(ball.id)}
                    />
                  )
              )}
              <Image className="tree-image" src={plantTreeimg} />
              {animation === 'water' && <Image className="water-animation" src={waterAnimations[waterAnimationIndex]} />}
              {animation === 'fertilize' && <Image className="fertilize-animation" src="https://i.111666.best/image/7Ivy8cnoKtElQxykCKRlVT.png" />}
              {animation === 'prune' && <Image className="prune-animation" src="https://i.111666.best/image/OdHiETezueRLV7qHKPCa2R.png" />}
              {animation === 'harvest' && <Image className="harvest-animation" src="https://i.111666.best/image/wuNRIDlTrjyBBSxxdPMtdB.png" />}
            </View>
            <View className="fruittree">
              <Text className="info-tree">我的果树</Text>
              <View className="ball-tree">
                <Text className="energy">成长值: {energy}</Text>
                <AtButton className='search-tree'
                  // onClick={handleSearchAction}
                          onClick={() => {
                            if(userInfo&&planttree.length>0){
                              console.log("种植Id:"+treeid);
                              Taro.navigateTo({
                                url: `/pages/subscribe/sub?plantid=${treeid}`,
                              });
                            }else if(!userInfo){
                              Taro.showToast({
                                title: '请先登录账号',
                                icon: 'none',
                              });
                            }else if(userInfo&&planttree.length===0){
                              Taro.showToast({
                                title: '请先加种一颗植物',
                                icon: 'none',
                              });
                            }
                          }}
                >
                  {/*查看果树*/}
                  YG预约
                </AtButton>
              </View>
            </View>
            <View className="button-group">
              {planttree.length>0 &&
                <Button className={`button ${waterDisabled ? 'disabled' : ''}`} onClick={handleWater} disabled={waterDisabled}>浇水</Button>
              }
              {planttree.length>0 &&
                <Button className={`button ${fertilizeDisabled ? 'disabled' : ''}`} onClick={handleFertilize} disabled={fertilizeDisabled}>施肥</Button>
              }
              {planttree.length>0 &&
                <Button className={`button ${pruneDisabled ? 'disabled' : ''}`} onClick={handlePrune} disabled={pruneDisabled}>修剪</Button>
              }
              <Button className={`button ${harvestDisabled ? 'disabled' : ''}`} onClick={handleHarvest} disabled={harvestDisabled}>收获</Button>
            </View>
          </View>
          <View className="tree-info">

            {fruitInfoData.map((item, index) => (
              <View key={index} className="action-item" data-toggle="info-description" onClick={() => toggleExpand(index)}>
                <Text className="bold-italic">
                  {item.title}
                </Text>
                {expanded[index] && (
                  <Text className="info-description">{item.description}</Text>
                )}
              </View>
            ))}
          </View>
          <View className="bottom-view">
            {/*<Button  className="generate-button"  onClick={handleGenerateEnergyBalls}>生成能量球</Button>*/}
          </View>

      {/*  </View>*/}
      {/*}*/}
    </View>
  );
}

