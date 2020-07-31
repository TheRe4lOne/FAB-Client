import { CircularProgress, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { FC, useState } from 'react';
import { CARDS_ENDPOINT } from 'src/consts/endpoints';
import { UTCard } from 'src/interfaces/UTCard';
import { Container } from 'src/styles/common/Container';
import { Flex } from 'src/styles/common/Flex';

const CardSearch: FC = () => {
  console.log('rendered');
  const [options, setOptions] = useState<UTCard[]>([]);
  const [isOpen, setOpen] = useState<boolean>(true);
  const [searchedText, setSearchedText] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false);
  // const [isSelected, setSelected] = useState<boolean>(false);
  let ok = false;
  const onChange = (selectedCard) => {
    // console.log(selectedCard);
    setOpen(false);
    selectedCard ? (ok = true) : (ok = false);
  };

  // useEffect(() => {
  //   console.log('in use effect');
  //   // if (isSelected || !searchedText) {
  //   //   ok = false;
  //   // }
  //   // ok = false;

  //   // searchCard();
  // }, [searchedText, isSelected]);

  const searchCard = debounce(async (val) => {
    setSearchedText(val);
    console.log('is selected', ok);
    if (val?.length > 2 && !ok) {
      try {
        setLoading(true);
        console.log('in search card');
        const { data } = await axios.get(`${CARDS_ENDPOINT}`, { params: { term: val } });
        setLoading(false);
        setOptions(data);
        data.length > 0 ? setOpen(true) : setOpen(false);
      } catch (err) {
        throw err;
      }
    } else {
      setOpen(false);
    }
  }, 500);

  const getLongestCardNameSubstring = (cardName: string) => {
    let firstAppearnce = cardName?.toLowerCase().indexOf(searchedText?.toLowerCase());
    if (cardName.length > 2 && firstAppearnce !== -1) {
      return [firstAppearnce, firstAppearnce + searchedText.length];
    }
    return [-1, -1];
  };

  return (
    <Flex>
      <Container>
        <Autocomplete
          options={options}
          freeSolo
          fullWidth
          selectOnFocus
          handleHomeEndKeys
          open={isOpen}
          noOptionsText={false}
          getOptionSelected={(option, value) => option.id === value.id}
          getOptionLabel={(option) => option.name}
          style={{ width: 500 }}
          spellCheck={false}
          onChange={(e, selectedCard) => onChange(selectedCard)}
          onInputChange={(e, val) => {
            console.log('in method on input change', val);
            searchCard(val);
          }}
          renderOption={(card: UTCard) => (
            <Flex>
              <div>
                {[...card.name].map((letter, index) =>
                  index >= getLongestCardNameSubstring(card.name)[0] && index < getLongestCardNameSubstring(card.name)[1] ? (
                    <b key={index}>{letter}</b>
                  ) : (
                    letter
                  )
                )}
              </div>
              <div>{card.rating}</div>
              <div>{card.id}</div>
            </Flex>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label='Search FUT 20 Players...'
              margin='normal'
              variant='outlined'
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </Container>
    </Flex>
  );
};
export default CardSearch;
/**
 * <AutoComplete
          placeholder='Search for FIFA 20 Player...'
          allowClear
          open={isOpen}
          autoFocus
          onBlur={() => setOpen(false)}
          filterOption={false}
          style={{ width: '50vw' }}
          onSelect={(selected: string, sec) => onSelect(selected, sec)}
          onSearch={(playerName) => searchCard(playerName)}
        >
          {console.log(options)}
          {options.map((card: UTCard) => (
            <Option key={card.id} value={card.id.toString()}>
              <div>
                {[...card.name].map((letter, index) =>
                  index >= getLongestCardNameSubstring(card.name)[0] && index < getLongestCardNameSubstring(card.name)[1] ? (
                    <b>{letter}</b>
                  ) : (
                    letter
                  )
                )}
              </div>
              <div>{card.rating}</div>
              <div>{card.id}</div>
            </Option>
          ))}
        </AutoComplete>
 */
