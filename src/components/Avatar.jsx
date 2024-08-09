
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAnimations, useFBX, useGLTF } from '@react-three/drei'
import {useControls} from 'leva'
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from "three";


const corresponding = {
  A: "viseme_PP",
  B: "viseme_kk",
  C: "viseme_I",
  D: "viseme_AA",
  E: "viseme_O",
  F: "viseme_U",
  G: "viseme_FF",
  H: "viseme_TH",
  X: "viseme_PP",
};


export function Avatar(props) {
  const {playAudio,script,headFollow}=useControls({ //added that audio control interface
    playAudio:false,headFollow:true,
    script:{
      value:"welcome",
      options:["welcome","intro"],
    },
  });

  const audio=useMemo(()=> new Audio(`/audios/${script}.mp3`),[script]); //added audio files
  const jsonFile=useLoader(THREE.FileLoader,`audios/${script}.json`);  //for lypsync
  const lipsync=JSON.parse(jsonFile);

  
  
  useFrame(()=>{
    const currentAudioTime=audio.currentTime;

    if (audio.paused || audio.ended) {
      setAnimation("Idle");
      return;
    }

    Object.values(corresponding).forEach((value)=>{
      nodes.Wolf3D_Head.morphTargetInfluences[
        nodes.Wolf3D_Head.morphTargetDictionary[value]
      ]=0;
      nodes.Wolf3D_Teeth.morphTargetInfluences[
        nodes.Wolf3D_Teeth.morphTargetDictionary[value]
      ]=0;
    });
    

    for(let i =0;i<lipsync.mouthCues.length;i++){
      const mouthCue = lipsync.mouthCues[i];
      if (
        currentAudioTime >= mouthCue.start &&
        currentAudioTime <= mouthCue.end
      ){
        console.log(mouthCue.value) //now we can see the value running in console(value means from json for lypsync .value have in rhubarb library)
        nodes.Wolf3D_Head.morphTargetInfluences[
          nodes.Wolf3D_Head.morphTargetDictionary[corresponding[mouthCue.value]]
        ]=1;
        nodes.Wolf3D_Teeth.morphTargetInfluences[
          nodes.Wolf3D_Teeth.morphTargetDictionary[corresponding[mouthCue.value]]
        ]=0;
        break;
      
      }

    }
  });


  useEffect(() => {
  
    if (playAudio) {
      audio.play();
      if (script === "welcome") {
        setAnimation("Idle");
      } else {
        setAnimation("Idle");
      }
    } else {
      setAnimation("Idle");
      audio.pause();
    }
  }, [playAudio, script, audio]); // Include `nodes` if it changes

  const { nodes, materials } = useGLTF(  // ur avatar glb link
);
  const { animations: idleAnimation } = useFBX("/animations/Idle.fbx");
  const { animations: angryAnimation } = useFBX(
    "/animations/Angry Gesture.fbx"
  );
  const { animations: greetingAnimation } = useFBX(
    "/animations/Standing Greeting.fbx"
  );
  idleAnimation[0].name = "Idle";
  angryAnimation[0].name = "Angry";
  greetingAnimation[0].name = "Greeting";

  const [animation, setAnimation] = useState("Idle");
  const group = useRef();
  const { actions } = useAnimations(
    [idleAnimation[0], angryAnimation[0], greetingAnimation[0]],
    group
  );

  // useEffect(()=>{
  //   console.log(nodes.Wolf3D_Head.morphTargetDictionary);
  //   // manually we can set avatar body movements
  //   nodes.Wolf3D_Head.morphTargetInfluences[nodes.Wolf3D_Head.morphTargetDictionary["viseme_O"]]=1;
  // },[]);

useEffect(() => {
  if (actions[animation]) {
    actions[animation].reset().fadeIn(0.5).play();
    return () => actions[animation].fadeOut(0.5);
  }
}, [animation, actions]); // Include `actions` here



  useFrame((state) => {
    if (headFollow) {
      group.current.getObjectByName("Head").lookAt(state.camera.position);
    }
  });
  

  return (
    <group {...props} dispose={null} ref={group}>
      <primitive object={nodes.Hips} />
      <skinnedMesh
        name="EyeLeft"
        geometry={nodes.EyeLeft.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeLeft.skeleton}
        morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences}
      />
      <skinnedMesh
        name="EyeRight"
        geometry={nodes.EyeRight.geometry}
        material={materials.Wolf3D_Eye}
        skeleton={nodes.EyeRight.skeleton}
        morphTargetDictionary={nodes.EyeRight.morphTargetDictionary}
        morphTargetInfluences={nodes.EyeRight.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Head"
        geometry={nodes.Wolf3D_Head.geometry}
        material={materials.Wolf3D_Skin}
        skeleton={nodes.Wolf3D_Head.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences}
      />
      <skinnedMesh
        name="Wolf3D_Teeth"
        geometry={nodes.Wolf3D_Teeth.geometry}
        material={materials.Wolf3D_Teeth}
        skeleton={nodes.Wolf3D_Teeth.skeleton}
        morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary}
        morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Hair.geometry}
        material={materials.Wolf3D_Hair}
        skeleton={nodes.Wolf3D_Hair.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Glasses.geometry}
        material={materials.Wolf3D_Glasses}
        skeleton={nodes.Wolf3D_Glasses.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Body.geometry}
        material={materials.Wolf3D_Body}
        skeleton={nodes.Wolf3D_Body.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Bottom.geometry}
        material={materials.Wolf3D_Outfit_Bottom}
        skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Footwear.geometry}
        material={materials.Wolf3D_Outfit_Footwear}
        skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton}
      />
      <skinnedMesh
        geometry={nodes.Wolf3D_Outfit_Top.geometry}
        material={materials.Wolf3D_Outfit_Top}
        skeleton={nodes.Wolf3D_Outfit_Top.skeleton}
      />
    </group>
  )
}

useGLTF.preload( // ur avatar glb link
  )