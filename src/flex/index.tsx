import styled from 'styled-components';

export const Flex = styled.div`
    -js-display: flex;
    display: flex;
    flex-direction: column;
`;

export const FlexCenter = styled(Flex)`
    justify-content: center;
    align-items: center;
`;

export const FlexRow = styled(Flex)`
    flex-direction: row;
    align-items: center;
`;

export const FlexRowCenter = styled(FlexRow)`
    justify-content: center;
`;

export const FlexOne = styled(Flex)`
    flex: 1;
`;

export const FlexOneCenter = styled(FlexOne)`
    align-items: center;
    justify-content: center;
`;

export default Flex;
