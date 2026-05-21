import PropTypes from 'prop-types';


const MiniCard = ({ miniCardItem }) => {
    const { name, number } = miniCardItem;

    return (
        <div className="shadow-xl p-5 rounded-xl flex flex-col">
            <h1 className='text-left text-xl font-medium'>{name}</h1>
            <h1 className='pt-5 pb-10 text-center text-6xl font-normal'>{number}</h1>
        </div>
    );
};


MiniCard.propTypes = {
    miniCardItem: PropTypes.object,

}

export default MiniCard;