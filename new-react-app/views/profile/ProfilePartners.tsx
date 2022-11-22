import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ProfileImage from '../ProfileImage';
import { observer } from 'mobx-react-lite';
import { profileContext } from './Profile';
import NameLink from '../NameLink';

const NUM_IMAGES = 4;
const IMAGE_SIZE = 35;
const IMAGE_OVERLAP = IMAGE_SIZE / 2;
const NUM_NAMES = 2;

const ProfilePartners = observer(() => {
  const {profilePartnerStore} = useContext(profileContext)

  const partners = profilePartnerStore.data;
  const imagePartners = partners.slice(0, NUM_IMAGES);
  const namePartners = partners.slice(0, NUM_NAMES);

  const textOffset = {
    paddingRight: IMAGE_OVERLAP * imagePartners.length + 20
  }

  return partners.length === 0 ? null
    :
    <View style={styles.container}>
      <View style={styles.listWrapper}>
        {imagePartners.map(p => (
          <View style={styles.imageListItem} key={p.userId} >
            <ProfileImage user={p} size={IMAGE_SIZE} />
          </View>
        ))}
      </View>

      <View style={[styles.textWrapper, textOffset]}>
          <Text style={styles.text}>
            Partner of&nbsp;
            { namePartners.length === 1 ?
              <NameLink key="namePartner" user={namePartners[0]} />

            : partners.length === NUM_NAMES ? 
              namePartners.map((p,i) => {
                <Text key={p.userId} >
                  <NameLink user={p} />
                  { i < namePartners.length - 2 ?
                    <Text>, </Text>
                  : i === namePartners.length - 1 ?
                    <Text> and </Text>
                  : null
                  }
                </Text>
              })
            
            : <>
              { namePartners.map((p,i) => 
                <Text key={p.userId}>
                  <NameLink user={p} />
                  { i < namePartners.length - 1 ?
                    <Text>, </Text>
                  : null
                  }
                </Text>
              )}
              <Text> and {partners.length - namePartners.length} other{partners.length - namePartners.length === 1 ? '' : 's'}</Text>
              </>
            }
          .</Text>
      </View>
    </View>
});

const styles = StyleSheet.create({
  container: {
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
    marginVertical: 5
  },
  listWrapper: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: IMAGE_OVERLAP + 10,
    marginLeft: 3,
  },
  imageListItem: {
    marginRight: -IMAGE_OVERLAP,
  },

  // For some reason I can't get the text area to maintain
  // its width at whatever is remaining to the side of the
  // profile images. It does fine when empty but when the
  // the text is added it extends outside of the screen to
  // the width of the screen before wrapping.
  // My solution is to give it padding on the right that is
  // the same width as the profile images and therefore hangs,
  // off of the screen instead of the text.
  textWrapper: {
    flexGrow: 1,
  },
  text: {
    fontSize: 15,
  },
});

export default ProfilePartners;
